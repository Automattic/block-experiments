<?php

add_action( 'init', function() {
	register_block_type( 'a8c/color-effects', [
		'editor_script' => 'block-experiments',
		'style' => 'block-experiments',
		'editor_style' => 'block-experiments-editor',
		'render_callback' => function( $attribs, $content ) {
			wp_enqueue_script( 'a8c-twgl-js' );
			wp_enqueue_script( 'a8c-color-effects-js' );
			return $content;
		}
	] );
	wp_register_script(
		'a8c-twgl-js',
		plugins_url( 'twgl/twgl.js', __FILE__ ),
		[], // no dependencies
		filemtime( plugin_dir_path( __FILE__ ) . 'twgl/twgl.js' ),
		true // in footer
	);
	wp_register_script(
		'a8c-color-effects-js',
		plugins_url( 'color-effects.js', __FILE__ ),
		[ 'a8c-twgl-js', 'lodash' ],
		filemtime( plugin_dir_path( __FILE__ ) . 'color-effects.js' ),
		true // in footer
	);
} );
