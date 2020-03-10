<?php

add_action( 'init', function() {
	register_block_type( 'a8c/motion-background', [
		'editor_script' => 'wpcom-blocks',
		'style' => 'wpcom-blocks',
		'editor_style' => 'wpcom-blocks-editor',
	] );
} );

add_action( 'enqueue_block_assets', function() {
	wp_enqueue_script(
		'wpcom-twgl-js',
		plugins_url( 'twgl/twgl.js', __FILE__ ),
		[], // no dependencies
		filemtime( plugin_dir_path( __FILE__ ) . 'twgl/twgl.js' ),
		true // in footer
	);
	wp_enqueue_script(
		'wpcom-motion-background-js',
		plugins_url( 'motion-background.js', __FILE__ ),
		[ 'wpcom-twgl-js', 'lodash' ],
		filemtime( plugin_dir_path( __FILE__ ) . 'motion-background.js' ),
		true // in footer
	);
} );
