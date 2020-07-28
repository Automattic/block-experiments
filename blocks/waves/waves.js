/**
 * Shaders based on fluid effect from {@link http://glslsandbox.com/e#8143.0}
 */

/* global wp */

( ( factory ) => {
	const a8cColorEffects = factory( window.twgl );
	if ( wp.editor ) {
		// Export for the editor so it can be run when a block is added.
		window.a8cColorEffects = a8cColorEffects;
	} else {
		const { parseColor, run } = a8cColorEffects;
		// Run the effect for all blocks on initial page load.
		wp.domReady( () => {
			document
				.querySelectorAll( '.wp-block-a8c-waves canvas' )
				.forEach( ( canvas ) => {
					const dataset = {
						color1: parseColor( canvas.dataset.color1 ),
						color2: parseColor( canvas.dataset.color2 ),
						color3: parseColor( canvas.dataset.color3 ),
						color4: parseColor( canvas.dataset.color4 ),
						complexity: Number.parseInt(
							canvas.dataset.complexity,
							10
						),
						mouseSpeed: Number.parseFloat(
							canvas.dataset.mouseSpeed
						),
						fluidSpeed: Number.parseFloat(
							canvas.dataset.fluidSpeed
						),
					};
					run( canvas, dataset );
				} );
		} );
	}
} )( ( twgl ) => {
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

		void main() {
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

	const mouseFunction = inverse( [ 1, 100 ], [ 50, 1 ] );
	const fluidFunction = inverse( [ 1, 100 ], [ 250, 1 ] );

	/**
	 * Get a inverse function mapping from the domain to the range.
	 *
	 * @param {number[]} domain Domain to map from
	 * @param {number[]} range Range to map to
	 * @return {Function} Inverse function mapping the domain to the range
	 */
	function inverse( [ x1, x2 ], [ y1, y2 ] ) {
		const a = ( x1 * x2 * ( -y1 + y2 ) ) / ( x1 - x2 );
		const b = ( x1 * y1 - x2 * y2 ) / ( x1 - x2 );
		return function ( x ) {
			return a / x + b;
		};
	}

	/**
	 * Initializes buffers and compiles the WebGL programs.
	 *
	 * @param {WebGLRenderingContext} gl WebGL rendering context
	 */
	const init = ( gl ) => ( {
		programInfoGradient: twgl.createProgramInfo( gl, [
			vertexShader,
			fragmentShader,
		] ),
		programInfoEffectPass: twgl.createProgramInfo( gl, [
			vertexShaderEffect,
			fragmentShaderEffect,
		] ),
		screenBufferInfo: twgl.createBufferInfoFromArrays( gl, {
			// prettier-ignore
			position: [
				-1, -1, 0,
				 1, -1, 0,
				-1,  1, 0,
				-1,  1, 0,
				 1, -1, 0,
				 1,  1, 0,
			],
			// prettier-ignore
			texcoord: [
				0, 0,
				1, 0,
				0, 1,
				0, 1,
				1, 0,
				1, 1
			]
		} ),
		textureInfo: twgl.createFramebufferInfo( gl, null, 512, 512 ),
	} );

	/**
	 * Draw an individual block.
	 *
	 * @param {WebGLRenderingContext} gl WebGL rendering context
	 * @param {Object} state Data state for the rendering frame
	 * @param {Object} program Collection of program info and buffers
	 */
	function renderBlock( gl, state, program ) {
		renderGradient( gl, state, program );
		renderLiquidEffect( gl, state, program );
	}

	/**
	 * The parsed dataset from the canvas.
	 *
	 * @typedef {Object} Dataset
	 * @property {number[]} color1     First color of the gradient.
	 * @property {number[]} color2     Second color of the gradient.
	 * @property {number[]} color3     Third color of the gradient.
	 * @property {number[]} color4     Fourth color of the gradient.
	 * @property {number}   complexity Integer complexity of the animation.
	 * @property {number}   mouseSpeed Float mouse speed of the animation.
	 * @property {number}   fluidSpeed Float fluid speed of the animation.
	 */

	/**
	 * Draw the custom gradient to the framebuffer.
	 *
	 * @param {WebGLRenderingContext} gl WebGL rendering context
	 * @param {Object} state State for the rendering frame.
	 * @param {Dataset} state.dataset Dataset to use for rendering.
	 * @param {Object} program Collection of program info and buffers.
	 * @param {Object} program.programInfoGradient Gradient program info.
	 * @param {Object} program.screenBufferInfo Screen buffer info.
	 * @param {Object} program.textureInfo Texture info.
	 */
	function renderGradient(
		gl,
		{ dataset },
		{ programInfoGradient, screenBufferInfo, textureInfo }
	) {
		const uniforms = {
			color1: dataset.color1,
			color2: dataset.color2,
			color3: dataset.color3,
			color4: dataset.color4,
		};

		twgl.bindFramebufferInfo( gl, textureInfo );
		gl.viewport( 0, 0, textureInfo.width, textureInfo.height );
		gl.clearColor( 1, 1, 1, 1 );
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT ); // eslint-disable-line no-bitwise
		gl.useProgram( programInfoGradient.program );
		twgl.setBuffersAndAttributes(
			gl,
			programInfoGradient,
			screenBufferInfo
		);
		twgl.setUniforms( programInfoGradient, uniforms );
		twgl.drawBufferInfo( gl, screenBufferInfo );
	}

	/**
	 * Draw the liquid effect to the canvas.
	 *
	 * @param {WebGLRenderingContext} gl WebGL rendering context.
	 * @param {Object} state Data state for the rendering frame.
	 * @param {Dataset} state.dataset Dataset to use for rendering.
	 * @param {number[]} state.mouse Mouse position [ x, y ].
	 * @param {number} state.time Current program time.
	 * @param {Object} program Collection of program info and buffers.
	 * @param {Object} program.programInfoEffectPass Effect pass program info.
	 * @param {Object} program.screenBufferInfo Screen buffer info.
	 * @param {Object} program.textureInfo Texture info.
	 */
	function renderLiquidEffect(
		gl,
		{ dataset, mouse, time },
		{ programInfoEffectPass, screenBufferInfo, textureInfo }
	) {
		const resolution = [ gl.canvas.width, gl.canvas.height ];
		const { complexity, mouseSpeed, fluidSpeed } = dataset;

		const uniforms = {
			// Required in the vertex shader to prevent stretching
			resolution,
			// Time since beginning of the program in seconds
			time: time * 0.001,
			// Mouse position in normalized block coordinates
			mouse: [
				mouse[ 0 ] / resolution[ 0 ],
				mouse[ 1 ] / resolution[ 1 ],
			],
			// 'Swirly-ness' of the effect
			complexity: 3 * complexity - 1,
			// Makes it more/less jumpy
			mouseSpeed: mouseFunction( mouseSpeed ) * 3 * complexity,
			// Drives speed, higher number will make it slower
			fluidSpeed: fluidFunction( fluidSpeed ),
			// Framebuffer texture from the first pass
			texture: textureInfo.attachments[ 0 ],
		};

		twgl.bindFramebufferInfo( gl, null ); // Draw to screen
		gl.viewport( 0, 0, gl.canvas.width, gl.canvas.height );
		gl.clearColor( 0, 0, 0, 0 );
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT ); // eslint-disable-line no-bitwise
		gl.useProgram( programInfoEffectPass.program );
		twgl.setBuffersAndAttributes(
			gl,
			programInfoEffectPass,
			screenBufferInfo
		);
		twgl.setUniforms( programInfoEffectPass, uniforms );
		twgl.drawBufferInfo( gl, screenBufferInfo );
	}

	return {
		/**
		 * Convert a hex color string to a WebGL color vector.
		 *
		 * @param {string} color Hex color string (#FFFFFF or #FFF)
		 * @return {number[]} RGB array for WebGL
		 */
		parseColor( color ) {
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

			return [ r / 0xff, g / 0xff, b / 0xff ];
		},

		/**
		 * Render a 512x512 px frame of the animation to use as a preview.
		 *
		 * @param {Dataset} dataset Dataset to use for rendering.
		 * @return {string} Data URI of a rendered frame.
		 */
		renderPreview( dataset ) {
			const canvas = document.createElement( 'canvas' );
			canvas.width = canvas.height = '512';

			const gl = twgl.getWebGLContext( canvas );

			const program = init( gl );

			const state = {
				dataset,
				mouse: [ 0, 0 ],
				time: 0,
			};

			renderBlock( gl, state, program );

			return gl.canvas.toDataURL();
		},

		/**
		 * Runs the animation.
		 *
		 * @param {HTMLCanvasElement} canvas Canvas to draw on.
		 * @param {Dataset} dataset Reference to a parsed dataset.
		 */
		run( canvas, dataset ) {
			const shouldAnimate = ! window.matchMedia(
				'(prefers-reduced-motion: reduce)'
			).matches;

			const gl = twgl.getWebGLContext( canvas, {
				failIfMajorPerformanceCaveat: true,
			} );
			if ( ! gl ) {
				// eslint-disable-next-line no-console
				console.warn(
					'WebGL must be enabled to view some content on this page.'
				);
				return;
			}

			const program = init( gl );

			const state = {
				dataset,
				mouse: [ 0, 0 ],
				time: window.performance.now(),
				rafId: 0,
			};

			/**
			 * Update mouse globals.
			 *
			 * @param {MouseEvent} e Mouse event
			 */
			function updateMouse( e ) {
				if ( shouldAnimate ) {
					state.mouse[ 0 ] = e.clientX;
					state.mouse[ 1 ] = gl.canvas.height - e.clientY; // From bottom
				}
			}
			document.body.addEventListener( 'mousemove', updateMouse );

			/**
			 * Run the animation loop.
			 *
			 * @param {DOMHighResTimeStamp} t Point in time when function begins to be called in milliseconds
			 */
			function animate( t ) {
				state.rafId = window.requestAnimationFrame( animate );
				if ( shouldAnimate ) {
					state.time = t;
				}
				twgl.resizeCanvasToDisplaySize( gl.canvas );
				renderBlock( gl, state, program );
			}
			state.rafId = window.requestAnimationFrame( animate );

			/**
			 * Clean up the effects for when a block is unmounted
			 */
			return function cleanup() {
				document.body.removeEventListener( 'mousemove', updateMouse );
				window.cancelAnimationFrame( state.rafId );
			};
		},
	};
} );
