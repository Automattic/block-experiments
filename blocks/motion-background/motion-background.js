/**
 * JavaScript to render multiple WebGL canvases
 * See https://webglfundamentals.org/webgl/lessons/webgl-multiple-views.html
 */

/* global twgl */

( function() {
	const blocks = document.getElementsByClassName( 'wp-block-a8c-motion-background' );

	const gl = document.createElement( 'canvas' ).getContext( 'webgl' );
	if ( ! gl ) {
		for ( const block of blocks ) {
			// TODO: I18n
			block.textContent = 'WebGL must be enabled to view this content.';
		}
	}

	gl.canvas.style.pointerEvents = 'none';
	gl.canvas.style.position = 'absolute';
	gl.canvas.style.top = 0;
	gl.canvas.style.left = 0;
	gl.canvas.style.width = '100%';
	gl.canvas.style.height = '100%';
	document.body.appendChild( gl.canvas );

	const programInfo = twgl.createProgramInfo( gl, [
		`
			attribute vec3 position;
	
			void main () {
				gl_Position = vec4( position, 1.0 );
			}
		`,
		`
			precision mediump float;

			const float PI_DOUBLE = 6.283185307;

			uniform float time;
			uniform float timeExecution;
			uniform float timeDelta;

			uniform vec2 mouse;
			uniform vec2 scroll;
			uniform vec2 window;
			uniform vec2 resolution;

			vec3 hsv2rgb( vec3 c ) {
			    vec4 K = vec4( 1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0 );
			    vec3 p = abs( fract( c.xxx + K.xyz ) * 6.0 - K.www );
			    return c.z * mix( K.xxx, clamp( p - K.xxx, 0.0, 1.0 ), c.y );
			}

			void main () {
				vec3 color = hsv2rgb( vec3( scroll.y / window.y, mouse / window ) );
				gl_FragColor = vec4( color, 1.0 );
			}
		`,
	] );

	const bufferInfo = twgl.createBufferInfoFromArrays( gl, {
		position: [ -1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0 ],
	} );

	const timeStart = window.performance.now();
	let time = timeStart;
	let timeDelta = 0;
	let timeExecution = 0;

	const mouse = [ 0, 0 ];

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
			const left = rect.left + 1;
			const bottom = gl.canvas.clientHeight - rect.bottom;

			gl.viewport( left, bottom, width, height );
			gl.scissor( left, bottom, width, height );
			gl.clearColor( 0, 0, 0, 0 ); // Clear to transparent to match background

			renderBlock( block, width, height );
		}
	}

	/**
	 * Draw an individual block.
	 *
	 * @param {Node} block Block to draw
	 * @param {number} width Width of the block
	 * @param {number} height Height of the block
	 */
	function renderBlock( block, width, height ) {
		// TODO: Extract data- values from the block for the individual settings

		const uniforms = {
			timeExecution,
			timeDelta,
			time,
			mouse,
			scroll: [ window.scrollX, window.scrollY ],
			window: [ gl.canvas.width, gl.canvas.height ],
			resolution: [ width, height ],
		};

		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT ); // eslint-disable-line no-bitwise
		gl.useProgram( programInfo.program );
		twgl.setBuffersAndAttributes( gl, programInfo, bufferInfo );
		twgl.setUniforms( programInfo, uniforms );
		twgl.drawBufferInfo( gl, gl.TRIANGLES, bufferInfo );
	}

	/**
	 * Update time globals.
	 *
	 * @param {DOMHighResTimeStamp} t Point in time when function begins to be called in milliseconds
	 */
	function updateTime( t ) {
		timeExecution = t - timeStart;
		timeDelta = t - time;
		time = t;
	}

	/**
	 * Update mouse globals.
	 *
	 * @param {MouseEvent} e Mouse event
	 */
	function updateMouse( e ) {
		mouse[ 0 ] = e.screenX;
		mouse[ 1 ] = e.screenY;
	}
	document.addEventListener( 'mousemove', updateMouse );

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
