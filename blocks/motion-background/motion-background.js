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

	// Based on http://glslsandbox.com/e#8143.0
	const programInfo = twgl.createProgramInfo( gl, [
		`
			attribute vec3 position;
	
			void main () {
				gl_Position = vec4( position, 1.0 );
			}
		`,
		`
			precision mediump float;

			uniform float time;

			uniform vec2 mouse;
			uniform vec2 resolution;
			uniform vec2 offset;

			const int max_complexity = 32;

			uniform int complexity;
			uniform float mouse_speed;
			uniform float mouse_curls;
			uniform float fluid_speed;
			uniform float color_intensity;

			void main() {
				vec2 p = ( 2.0 * ( gl_FragCoord.xy - offset ) - resolution ) / max( resolution.x, resolution.y );
				for ( int i = 1; i < max_complexity; i++ ) {
					if ( i >= complexity ) continue;
					vec2 q = p + ( time * 0.001 );
					q.x += 0.6 / float( i ) * sin( ( float( i ) * p.y ) + ( time / fluid_speed ) + ( 0.3 * float( i ) ) );
					q.x += 0.5 + ( mouse.y / resolution.y / mouse_speed ) + mouse_curls;
					q.y += 0.6 / float( i ) * sin( ( float( i ) * p.x ) + ( time / fluid_speed ) + ( 0.3 * float( i + 10 ) ) );
					q.y -= 0.5 - ( mouse.x / resolution.x / mouse_speed ) + mouse_curls;
					p = q;
				}
				gl_FragColor = vec4(
					( color_intensity * sin( 3.0 * p.x ) ) + ( 1.0 - color_intensity ),
					( color_intensity * sin( 3.0 * p.y ) ) + ( 1.0 - color_intensity ),
					( color_intensity * sin( p.x + p.y ) ) + ( 1.0 - color_intensity ),
					1.0
				);
			}
		`,
	] );

	const bufferInfo = twgl.createBufferInfoFromArrays( gl, {
		position: [ -1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0 ],
	} );

	let time = window.performance.now() * 0.001;

	const mouseScreen = [ 0, 0 ];

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

			const resolution = [ width, height ];
			const offset = [ left, bottom ];
			const mouse = [ mouseScreen[ 0 ] - left, mouseScreen[ 1 ] - bottom ];

			renderBlock( block, resolution, offset, mouse );
		}
	}

	/**
	 * Draw an individual block.
	 *
	 * @param {Node} block Block to draw
	 * @param {number[]} resolution The [ x, y ] resolution of the block
	 * @param {number[]} offset The [ x, y ] offset for the block
	 * @param {number[]} mouse The [ x, y ] coordinates of the mouse
	 */
	function renderBlock( block, resolution, offset, mouse ) {
		const globalUniforms = { time };

		const blockUniforms = { resolution, offset, mouse };

		const complexity = Number.parseInt( block.dataset.complexity, 10 );
		const mouseSpeed = Number.parseFloat( block.dataset.mouseSpeed );
		const mouseCurls = Number.parseFloat( block.dataset.mouseCurls );
		const fluidSpeed = Number.parseFloat( block.dataset.fluidSpeed );
		const colorIntensity = Number.parseFloat( block.dataset.colorIntensity );

		const dataUniforms = {
			// More points of color.
			complexity,
			// Makes it more/less jumpy. Range [50, 1]
			mouse_speed: ( 4 * ( 175 + mouseSpeed ) ) / ( 11 * mouseSpeed ) * complexity,
			// Drives complexity in the amount of curls/curves. Zero is a single whirlpool.
			mouse_curls: mouseCurls / 10,
			// Drives speed, higher number will make it slower. Range [256, 1]
			fluid_speed: -( 4 * ( -2125 + ( 13 * fluidSpeed ) ) ) / ( 33 * fluidSpeed ),
			// Changes how bright the colors are
			color_intensity: colorIntensity / 100,
		};

		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT ); // eslint-disable-line no-bitwise
		gl.useProgram( programInfo.program );
		twgl.setBuffersAndAttributes( gl, programInfo, bufferInfo );
		twgl.setUniforms( programInfo, globalUniforms, blockUniforms, dataUniforms );
		twgl.drawBufferInfo( gl, gl.TRIANGLES, bufferInfo );
	}

	/**
	 * Update time globals.
	 *
	 * @param {DOMHighResTimeStamp} t Point in time when function begins to be called in milliseconds
	 */
	function updateTime( t ) {
		time = t * 0.001;
	}

	/**
	 * Update mouse globals.
	 *
	 * @param {MouseEvent} e Mouse event
	 */
	function updateMouse( e ) {
		mouseScreen[ 0 ] = e.screenX;
		mouseScreen[ 1 ] = e.screenY;
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
