<?php

add_action( 'init', function() {
	register_block_type( 'a8c/waves', [
		'editor_script' => 'block-experiments',
		'style' => 'block-experiments',
		'editor_style' => 'block-experiments-editor',
		'render_callback' => function( $attribs, $content ) {
			wp_enqueue_script( 'a8c-waves-js' );
			return $content;
		},
	] );
	wp_register_script(
		'a8c-twgl-js',
		plugins_url( 'twgl/twgl.js', __FILE__ ),
		[], // no dependencies
		filemtime( plugin_dir_path( __FILE__ ) . 'twgl/twgl.js' ),
		true // in footer
	);
	wp_register_script(
		'a8c-waves-js',
		plugins_url( 'waves.js', __FILE__ ),
		[ 'a8c-twgl-js' ],
		filemtime( plugin_dir_path( __FILE__ ) . 'waves.js' ),
		true // in footer
	);
} );

add_action( 'enqueue_block_editor_assets', function() {
	wp_enqueue_script( 'a8c-waves-js' );
} );
