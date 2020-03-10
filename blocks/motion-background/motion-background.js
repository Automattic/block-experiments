/**
 * Shaders based on fluid effect from {@link http://glslsandbox.com/e#8143.0}
 * Draws multiple blocks on a canvas using a technique from {@link https://webglfundamentals.org/webgl/lessons/webgl-multiple-views.html}
 */

( function( _, twgl ) {
	if ( document.getElementById( 'editor' ) ) {
		return; // TODO: disable this properly rather than with this return
	}

	const blocks = document.getElementsByClassName( 'wp-block-a8c-motion-background' );

	const gl = twgl.getWebGLContext( document.createElement( 'canvas' ) );
	gl.canvas.className = 'wp-block-a8c-motion-background-canvas';
	if ( ! gl ) {
		_.forEach( blocks, ( block ) => {
			// TODO: I18n
			block.textContent = 'WebGL must be enabled to view this content.';
		} );
		return;
	}

	document.body.insertBefore( gl.canvas, document.body.firstChild );

	const vertexShader = `
		attribute vec3 position;
		attribute vec2 texcoord;

		varying vec2 uv;
	
		void main () {
			uv = texcoord;
			gl_Position = vec4( position, 1. );
		}
	`;

	const fragmentShader = `
		precision mediump float;

		#define SRGB_TO_LINEAR( c ) pow( c, vec3( 2.2 ) )
		#define LINEAR_TO_SRGB( c ) pow( c, vec3( 1.0 / 2.2 ) )

		uniform vec3 color1;
		uniform vec3 color2;
		uniform vec3 color3;
		uniform vec3 color4;

		varying vec2 uv;

		void main()
		{      
			vec3 tl = SRGB_TO_LINEAR( color1 );
			vec3 tr = SRGB_TO_LINEAR( color2 );
			vec3 bl = SRGB_TO_LINEAR( color3 );
			vec3 br = SRGB_TO_LINEAR( color4 );

			vec3 top = mix( tl, tr, uv.x );
			vec3 bottom = mix( bl, br, uv.x );
			vec3 gradient =  mix( bottom, top, uv.y ) ;

			gl_FragColor = vec4( LINEAR_TO_SRGB( gradient ), 1. );
		}
	`;

	const vertexShaderEffect = `
		attribute vec3 position;
		attribute vec2 texcoord;

		uniform vec2 resolution;

		varying vec2 uv;
	
		void main () {
			uv = texcoord * normalize( resolution );
			gl_Position = vec4( position, 1. );
		}
	`;

	const fragmentShaderEffect = `
		precision mediump float;

		#define MAX_COMPLEXITY 32
		#define MIRRORED_REPEAT( p ) abs( 2. * fract( p / 2. ) - 1. )

		uniform float time;

		uniform vec2 mouse;
		uniform int complexity;
		uniform float mouseSpeed;
		uniform float fluidSpeed;
		uniform sampler2D texture;

		varying vec2 uv;

		void main() {
			vec2 c = uv;
			for ( int i = 1; i < MAX_COMPLEXITY; i++ ) {
				if ( i >= complexity ) continue;
				float f = float( i );
				c += ( time * 0.001 );
				c.x += 0.6 / f * sin( ( f * c.y ) + ( time / fluidSpeed ) + ( 0.3 * f ) );
				c.x += 0.5 + ( mouse.y / mouseSpeed );
				c.y += 0.6 / f * sin( ( f * c.x ) + ( time / fluidSpeed ) + ( 0.3 * f + 10. ) );
				c.y -= 0.5 - ( mouse.x / mouseSpeed );
			}
			gl_FragColor = texture2D( texture, MIRRORED_REPEAT( c ) );
		}
	`;

	const programInfoGradient = twgl.createProgramInfo( gl, [ vertexShader, fragmentShader ] );
	const programInfoEffectPass = twgl.createProgramInfo( gl, [ vertexShaderEffect, fragmentShaderEffect ] );

	const screenBufferInfo = twgl.createBufferInfoFromArrays( gl, {
		position: [ -1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0 ], // vec3
		texcoord: [ 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1 ], // vec2
	} );

	const textureInfos = new WeakMap();

	const globalState = {
		time: window.performance.now(),
		mouse: [ 0, 0 ],
	};

	/**
	 * Manage rendering all of the blocks by calculating the position of each
	 * div and only rendering the blocks on screen. The position information is
	 * sent to the render functions to allow them to do a viewport change and
	 * scissor test for that specific block.
	 */
	function renderAllBlocks() {
		twgl.resizeCanvasToDisplaySize( gl.canvas );

		// Move the canvas to top of the current scroll position without jittering
		gl.canvas.style.transform = `translateY(${ window.scrollY }px)`;

		gl.enable( gl.CULL_FACE );
		gl.enable( gl.DEPTH_TEST );
		gl.enable( gl.SCISSOR_TEST );

		gl.viewport( 0, 0, gl.canvas.width, gl.canvas.height );
		gl.scissor( 0, 0, gl.canvas.width, gl.canvas.height );
		gl.clearColor( 0, 0, 0, 0 );
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT ); // eslint-disable-line no-bitwise

		_.forEach( blocks, ( block ) => {
			const rect = block.getBoundingClientRect();

			if (
				rect.bottom < 0 ||
				rect.top > gl.canvas.clientHeight ||
				rect.right < 0 ||
				rect.left > gl.canvas.clientWidth
			) {
				return; // Block is off screen
			}

			const width = rect.right - rect.left;
			const height = rect.bottom - rect.top;
			const left = rect.left;
			const bottom = gl.canvas.clientHeight - rect.bottom;

			renderBlock( block, [ width, height ], [ left, bottom ] );
		} );
	}

	/**
	 * Draw an individual block.
	 *
	 * @param {Node} block Block's DOM Node
	 * @param {number[]} resolution Pixel [ width, height ] resolution of the block
	 * @param {number[]} offset Pixel [ left, bottom ] offset of the block
	 */
	function renderBlock( block, resolution, offset ) {
		let textureInfo = textureInfos.get( block );

		if (
			! textureInfo ||
			textureInfo.mode !== block.dataset.mode ||
			textureInfo.imageUrl !== block.dataset.imageUrl
		) {
			if ( block.dataset.mode === 'image' ) {
				// Default to semi-transparent placeholder color
				const src = block.dataset.imageUrl || [ 0.55, 0.55, 0.59, 0.1 ];
				// Match the structure of what createFramebufferInfo makes for the WebGLTexture
				textureInfo = {
					mode: block.dataset.mode,
					imageUrl: block.dataset.imageUrl,
					attachments: [ twgl.createTexture( gl, { src } ) ],
				};
			} else if ( block.dataset.mode === 'gradient' ) {
				// A 512x512 resolution seemed to have a smooth enough gradient for the size of blocks
				textureInfo = twgl.createFramebufferInfo( gl, null, 512, 512 );
				textureInfo.mode = block.dataset.mode;
				textureInfos.set( block, textureInfo );
			}
			textureInfos.set( block, textureInfo );
		}

		if ( block.dataset.mode === 'gradient' ) {
			renderGradient( block.dataset, textureInfo );
		}
		renderLiquidEffect( block.dataset, resolution, offset, textureInfo );
	}

	/**
	 * Convert a hex color string to a WebGL color vector.
	 *
	 * @param {string} color Hex color string (#FFFFFF or #FFF)
	 * @return {number[]} RGB array for WebGL
	 */
	function parseColor( color ) {
		let r = '0';
		let g = '0';
		let b = '0';

		if ( color.length === 7 ) {
			r = '0x' + color[ 1 ] + color[ 2 ];
			g = '0x' + color[ 3 ] + color[ 4 ];
			b = '0x' + color[ 5 ] + color[ 6 ];
		} else if ( color.length === 4 ) {
			r = '0x' + color[ 1 ] + color[ 1 ];
			g = '0x' + color[ 2 ] + color[ 2 ];
			b = '0x' + color[ 3 ] + color[ 3 ];
		}

		return [ r / 0xFF, g / 0xFF, b / 0xFF ];
	}

	/**
	 * @typedef {Object} FramebufferInfo
	 * @see {@link https://twgljs.org/docs/module-twgl.html#.FramebufferInfo}
	 * Either a twlg FramebufferInfo or an image texture in the same shape as
	 * a FramebufferInfo.
	 */

	/**
	 * Draw the custom gradient to the framebuffer.
	 *
	 * @param {Object} blockData Dataset from block
	 * @param {FramebufferInfo} textureInfo Framebuffer info from twgl
	 */
	function renderGradient( blockData, textureInfo ) {
		const uniforms = {
			color1: parseColor( blockData.color1 || '#F00' ),
			color2: parseColor( blockData.color2 || '#0F0' ),
			color3: parseColor( blockData.color3 || '#000' ),
			color4: parseColor( blockData.color4 || '#00F' ),
		};

		twgl.bindFramebufferInfo( gl, textureInfo );
		gl.viewport( 0, 0, textureInfo.width, textureInfo.height );
		gl.scissor( 0, 0, textureInfo.width, textureInfo.height );
		gl.clearColor( 1, 1, 1, 1 );
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT ); // eslint-disable-line no-bitwise
		gl.useProgram( programInfoGradient.program );
		twgl.setBuffersAndAttributes( gl, programInfoGradient, screenBufferInfo );
		twgl.setUniforms( programInfoGradient, uniforms );
		twgl.drawBufferInfo( gl, screenBufferInfo );
	}

	/**
	 * Draw the liquid effect to the canvas.
	 *
	 * @param {Object} blockData Dataset from block
	 * @param {number[]} resolution Pixel [ width, height ] resolution of the block
	 * @param {number[]} offset Pixel [ left, bottom ] offset of the block
	 * @param {FramebufferInfo} textureInfo Framebuffer info from twgl
	 */
	function renderLiquidEffect( blockData, resolution, offset, textureInfo ) {
		const complexity = Number.parseInt( blockData.complexity, 10 );
		const mouseSpeed = Number.parseFloat( blockData.mouseSpeed );
		const fluidSpeed = Number.parseFloat( blockData.fluidSpeed );

		const uniforms = {
			// Required in the vertex shader to prevent stretching
			resolution,
			// Time since beginning of the program in seconds
			time: globalState.time * 0.001,
			// Mouse position in normalized block coordinates
			mouse: globalState.mouse.map( ( v, i ) => ( v - offset[ i ] ) / resolution[ i ] ),
			// 'Swirly-ness' of the effect
			complexity,
			// Makes it more/less jumpy. f(x) from [1, 100] to [50, 1]
			mouseSpeed: ( 700 + ( 4 * mouseSpeed ) ) / ( 11 * mouseSpeed ) * complexity,
			// Drives speed, higher number will make it slower. f(x) from [1, 100] to [256, 1]
			fluidSpeed: ( 8500 - ( 52 * fluidSpeed ) ) / ( 33 * fluidSpeed ),
			// Framebuffer texture from the first pass
			texture: textureInfo.attachments[ 0 ],
		};

		twgl.bindFramebufferInfo( gl, null ); // Draw to screen
		gl.viewport( ...offset, ...resolution );
		gl.scissor( ...offset, ...resolution );
		gl.clearColor( 0, 0, 0, 0 );
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT ); // eslint-disable-line no-bitwise
		gl.useProgram( programInfoEffectPass.program );
		twgl.setBuffersAndAttributes( gl, programInfoEffectPass, screenBufferInfo );
		twgl.setUniforms( programInfoEffectPass, uniforms );
		twgl.drawBufferInfo( gl, screenBufferInfo );
	}

	/**
	 * Update mouse globals.
	 *
	 * @param {MouseEvent} e Mouse event
	 */
	function updateMouse( e ) {
		globalState.mouse[ 0 ] = e.clientX;
		globalState.mouse[ 1 ] = gl.canvas.height - e.clientY; // From bottom
	}
	document.body.addEventListener( 'mousemove', updateMouse );

	/**
	 * Run the animation loop.
	 *
	 * @param {DOMHighResTimeStamp} t Point in time when function begins to be called in milliseconds
	 */
	function animate( t ) {
		window.requestAnimationFrame( animate );
		globalState.time = t;
		renderAllBlocks();
	}
	window.requestAnimationFrame( animate );
}( window.lodash, window.twgl ) );
