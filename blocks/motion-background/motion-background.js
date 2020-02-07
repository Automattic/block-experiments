/**
 * JavaScript to render multiple WebGL canvases
 * See https://webglfundamentals.org/webgl/lessons/webgl-multiple-views.html
 */

/* global twgl */

( function() {
	const blocks = document.getElementsByClassName( 'wp-block-a8c-motion-background' );

	const gl = document.createElement( 'canvas' ).getContext( 'webgl' );
	gl.canvas.className = 'wp-block-a8c-motion-background-canvas';
	if ( ! gl ) {
		for ( const block of blocks ) {
			// TODO: I18n
			block.textContent = 'WebGL must be enabled to view this content.';
		}
		return;
	}

	// TODO: Position z-index below editor UI, but above content
	// Ideally it would be after .edit-post-editor-regions__body, but that node
	// doesn't exist. Unfortunately, this means that the block is going to be
	// drawn on top of some UI elements. Maybe we'll have to insert the canvas
	// in the block code, but we'll have to make sure that there's only one
	// canvas still.
	const editor = document.getElementById( 'editor' );
	if ( editor ) {
		editor.parentNode.insertBefore( gl.canvas, editor.nextSibling ); // insertAfter
	} else {
		document.body.appendChild( gl.canvas );
	}

	const vertexShader = `
		attribute vec3 position;
		attribute vec2 texcoord;

		varying vec2 uv;
	
		void main () {
			uv = texcoord;
			gl_Position = vec4( position, 1. );
		}
	`;

	// Blend gradients in the linear color space for more accurate intermediate colors
	const fragmentShader = `
		precision mediump float;

		#define SRGB_TO_LINEAR( c ) pow( c, vec3( 2.2 ) )
		#define LINEAR_TO_SRGB( c ) pow( c, vec3( 1.0 / 2.2 ) )

		uniform vec2 resolution;
		uniform vec2 offset;
		uniform vec2 mouse;

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

	// Based on http://glslsandbox.com/e#8143.0
	const programInfoGradient = twgl.createProgramInfo( gl, [ vertexShader, fragmentShader ] );
	const programInfoEffectPass = twgl.createProgramInfo( gl, [ vertexShader, fragmentShaderEffect ] );

	const screenBufferInfo = twgl.createBufferInfoFromArrays( gl, {
		position: [ -1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0 ], // vec3
		texcoord: [ 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1 ], // vec2
	} );

	// Will get populated during the loop so we can add framebufferInfos as blocks are added to
	// the live HTMLCollection list
	const framebufferInfos = new WeakMap();

	const globalUniforms = {
		time: window.performance.now() * 0.001,
		mouseScreen: [ 0, 0 ],
	};

	/**
	 * Manage rendering the various different blocks.
	 */
	function renderAllBlocks() {
		// TODO: Can this be moved to a resize event instead?
		twgl.resizeCanvasToDisplaySize( gl.canvas );

		// Move the canvas to top of the current scroll position without jittering
		gl.canvas.style.transform = `translateY(${ window.scrollY }px)`;

		gl.enable( gl.CULL_FACE );
		gl.enable( gl.DEPTH_TEST );
		gl.enable( gl.SCISSOR_TEST );

		for ( const block of blocks ) {
			const rect = block.getBoundingClientRect();

			if (
				rect.bottom < 0 ||
				rect.top > gl.canvas.clientHeight ||
				rect.right < 0 ||
				rect.left > gl.canvas.clientWidth
			) {
				continue; // Block is off screen
			}

			const width = rect.right - rect.left;
			const height = rect.bottom - rect.top;
			const left = rect.left;
			const bottom = gl.canvas.clientHeight - rect.bottom;

			renderBlock( block, width, height, left, bottom );
		}
	}

	/**
	 * Draw an individual block.
	 *
	 * @param {Node} block Block's DOM Node
	 * @param {number} width Pixel width of the block
	 * @param {number} height Pixel height of the block
	 * @param {number} left Pixel offset from left
	 * @param {number} bottom Pixel offset from bottom
	 */
	function renderBlock( block, width, height, left, bottom ) {
		const resolution = [ width, height ];
		const offset = [ left, bottom ];
		const mouse = globalUniforms.mouseScreen.map( ( v, i ) => ( v - offset[ i ] ) / resolution[ i ] );

		const blockUniforms = { resolution, offset, mouse };

		if ( ! framebufferInfos.has( block ) ) {
			framebufferInfos.set( block, twgl.createFramebufferInfo( gl, null, 512, 512 ) );
		}

		const framebufferInfo = framebufferInfos.get( block );

		renderGradient( block, blockUniforms, framebufferInfo );
		renderEffect( block, blockUniforms, framebufferInfo );
	}

	function parseColor( color ) {
		let r, g, b;

		if ( color.length === 4 ) {
			r = '0x' + color[ 1 ] + color[ 1 ];
			g = '0x' + color[ 2 ] + color[ 2 ];
			b = '0x' + color[ 3 ] + color[ 3 ];
		} else if ( color.length === 7 ) {
			r = '0x' + color[ 1 ] + color[ 2 ];
			g = '0x' + color[ 3 ] + color[ 4 ];
			b = '0x' + color[ 5 ] + color[ 6 ];
		}

		return [
			+( r / 255 ).toFixed( 1 ),
			+( g / 255 ).toFixed( 1 ),
			+( b / 255 ).toFixed( 1 ),
		];
	}

	/**
	 * @typedef {Object} FramebufferInfo
	 * @see {@link https://twgljs.org/docs/module-twgl.html#.FramebufferInfo}
	 */

	/**
	 * Draw the custom gradient to the framebuffer
	 *
	 * @param {Node} block Block to draw
	 * @param {Object} blockUniforms Per-block uniforms
	 * @param {number[]} blockUniforms.resolution The [ x, y ] resolution of the block
	 * @param {number[]} blockUniforms.offset The [ x, y ] offset for the block
	 * @param {number[]} blockUniforms.mouse The [ x, y ] coordinates of the mouse
	 * @param {number[]} blockUniforms.matrix The mat4 transformation matrix for positioning the block
	 * @param {FramebufferInfo} framebufferInfo Framebuffer info from twgl
	 */
	function renderGradient( block, blockUniforms, framebufferInfo ) {
		const colorUniforms = {
			color1: parseColor( block.dataset.color1 || '#F00' ),
			color2: parseColor( block.dataset.color2 || '#FF0' ),
			color3: parseColor( block.dataset.color3 || '#0FF' ),
			color4: parseColor( block.dataset.color4 || '#0F0' ),
		};

		// TODO: We only need to render the framebuffer when the uniforms change
		twgl.bindFramebufferInfo( gl, framebufferInfo );
		gl.viewport( 0, 0, framebufferInfo.width, framebufferInfo.height );
		gl.scissor( 0, 0, framebufferInfo.width, framebufferInfo.height );
		gl.clearColor( 1, 1, 1, 1 );
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT ); // eslint-disable-line no-bitwise
		gl.useProgram( programInfoGradient.program );
		twgl.setBuffersAndAttributes( gl, programInfoGradient, screenBufferInfo );
		twgl.setUniforms( programInfoGradient, blockUniforms, colorUniforms );
		twgl.drawBufferInfo( gl, screenBufferInfo );
	}

	/**
	 * Draw the custom gradient to the framebuffer
	 *
	 * @param {Node} block Block to draw
	 * @param {Object} blockUniforms Per-block uniforms
	 * @param {number[]} blockUniforms.resolution The [ x, y ] resolution of the block
	 * @param {number[]} blockUniforms.offset The [ x, y ] offset for the block
	 * @param {number[]} blockUniforms.mouse The [ x, y ] coordinates of the mouse
	 * @param {number[]} blockUniforms.matrix The mat4 transformation matrix for positioning the block
	 * @param {FramebufferInfo} framebufferInfo Framebuffer info from twgl
	 */
	function renderEffect( block, blockUniforms, framebufferInfo ) {
		const { offset, resolution } = blockUniforms;

		const complexity = Number.parseInt( block.dataset.complexity, 10 );
		const mouseSpeed = Number.parseFloat( block.dataset.mouseSpeed );
		const fluidSpeed = Number.parseFloat( block.dataset.fluidSpeed );

		const effectUniforms = {
			// More points of color.
			complexity,
			// Makes it more/less jumpy. Range [50, 1]
			mouseSpeed: ( 4 * ( 175 + mouseSpeed ) ) / ( 11 * mouseSpeed ) * complexity,
			// Drives speed, higher number will make it slower. Range [256, 1]
			fluidSpeed: -( 4 * ( -2125 + ( 13 * fluidSpeed ) ) ) / ( 33 * fluidSpeed ),
			// Framebuffer from the first pass
			texture: framebufferInfo.attachments[ 0 ],
		};

		twgl.bindFramebufferInfo( gl, null ); // Draw to screen
		gl.viewport( ...offset, ...resolution );
		gl.scissor( ...offset, ...resolution );
		gl.clearColor( 0, 0, 0, 0 );
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT ); // eslint-disable-line no-bitwise
		gl.useProgram( programInfoEffectPass.program );
		twgl.setBuffersAndAttributes( gl, programInfoEffectPass, screenBufferInfo );
		twgl.setUniforms( programInfoEffectPass, globalUniforms, blockUniforms, effectUniforms );
		twgl.drawBufferInfo( gl, screenBufferInfo );
	}

	/**
	 * Update time globals.
	 *
	 * @param {DOMHighResTimeStamp} t Point in time when function begins to be called in milliseconds
	 */
	function updateTime( t ) {
		globalUniforms.time = t * 0.001;
	}

	/**
	 * Update mouse globals.
	 *
	 * @param {MouseEvent} e Mouse event
	 */
	function updateMouse( e ) {
		globalUniforms.mouseScreen[ 0 ] = e.clientX;
		globalUniforms.mouseScreen[ 1 ] = gl.canvas.height - e.clientY; // From bottom
	}
	document.body.addEventListener( 'mousemove', updateMouse );

	/**
	 * Run the animation loop.
	 *
	 * @param {DOMHighResTimeStamp} t Point in time when function begins to be called in milliseconds
	 */
	function animate( t ) {
		window.requestAnimationFrame( animate );
		updateTime( t );
		renderAllBlocks();
	}
	window.requestAnimationFrame( animate );
}() );
