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
		// Run the effect for all blocks on initial page load.
		wp.domReady( () => {
			document
				.querySelectorAll( '.wp-block-a8c-color-effects canvas' )
				.forEach( a8cColorEffects.run );
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

	return {
		run( canvas ) {
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

			const {
				programInfoGradient,
				programInfoEffectPass,
				screenBufferInfo,
				textureInfo,
			} = init( gl );

			const mouse = [ 0, 0 ];
			let time = window.performance.now();
			let rafId = 0;

			/**
			 * Draw an individual block.
			 */
			function renderBlock() {
				twgl.resizeCanvasToDisplaySize( gl.canvas );
				renderGradient();
				renderLiquidEffect();
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

				return [ r / 0xff, g / 0xff, b / 0xff ];
			}

			/**
			 * Draw the custom gradient to the framebuffer.
			 */
			function renderGradient() {
				const uniforms = {
					color1: parseColor( gl.canvas.dataset.color1 ),
					color2: parseColor( gl.canvas.dataset.color2 ),
					color3: parseColor( gl.canvas.dataset.color3 ),
					color4: parseColor( gl.canvas.dataset.color4 ),
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
			 */
			function renderLiquidEffect() {
				const resolution = [ gl.canvas.width, gl.canvas.height ];
				const complexity = Number.parseInt(
					gl.canvas.dataset.complexity,
					10
				);
				const mouseSpeed = Number.parseFloat(
					gl.canvas.dataset.mouseSpeed
				);
				const fluidSpeed = Number.parseFloat(
					gl.canvas.dataset.fluidSpeed
				);

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
					complexity,
					// Makes it more/less jumpy. f(x) from [1, 100] to [50, 1]
					mouseSpeed:
						( ( 700 + 4 * mouseSpeed ) / ( 11 * mouseSpeed ) ) *
						complexity,
					// Drives speed, higher number will make it slower. f(x) from [1, 100] to [256, 1]
					fluidSpeed:
						( 8500 - 52 * fluidSpeed ) / ( 33 * fluidSpeed ),
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

			/**
			 * Update mouse globals.
			 *
			 * @param {MouseEvent} e Mouse event
			 */
			function updateMouse( e ) {
				if ( shouldAnimate ) {
					mouse[ 0 ] = e.clientX;
					mouse[ 1 ] = gl.canvas.height - e.clientY; // From bottom
				}
			}
			document.body.addEventListener( 'mousemove', updateMouse );

			/**
			 * Run the animation loop.
			 *
			 * @param {DOMHighResTimeStamp} t Point in time when function begins to be called in milliseconds
			 */
			function animate( t ) {
				rafId = window.requestAnimationFrame( animate );
				if ( shouldAnimate ) {
					time = t;
				}
				renderBlock( canvas.dataset );
			}
			rafId = window.requestAnimationFrame( animate );

			/**
			 * Clean up the effects for when a block is unmounted
			 */
			return function cleanup() {
				document.body.removeEventListener( 'mousemove', updateMouse );
				window.cancelAnimationFrame( rafId );
			};
		},
	};
} );
