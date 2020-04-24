<?php

add_action( 'init', function() {
	register_block_type( 'jetpack/layout-grid', [
		'editor_script' => 'block-experiments',
		'style' => 'block-experiments',
		'editor_style' => 'block-experiments-editor',
	] );

	register_block_type( 'jetpack/layout-grid-column', [
		'editor_script' => 'block-experiments',
		'style' => 'block-experiments',
		'editor_style' => 'block-experiments-editor',
	] );

	wp_set_script_translations( 'jetpack/layout-grid', 'layout-grid' );
} );

add_action( 'wp_enqueue_scripts', function() {
	wp_enqueue_style(
		'wpcom-layout-grid-front',
		plugins_url( 'front.css', __FILE__ ),
		[], // no dependencies
		filemtime( plugin_dir_path( __FILE__ ) . 'front.css' )
	);
} );
