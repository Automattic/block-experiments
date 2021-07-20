<?php

add_action( 'init', function() {
	register_block_type( 'a8c/waves', [
		'script' => 'a8c-waves-js',
		'editor_script' => 'block-experiments',
		'style' => 'block-experiments',
		'editor_style' => 'block-experiments-editor',
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
		[ 'a8c-twgl-js', 'wp-dom-ready' ],
		filemtime( plugin_dir_path( __FILE__ ) . 'waves.js' ),
		true // in footer
	);
} );

add_filter( 'should_load_separate_core_block_assets', '__return_true' );
