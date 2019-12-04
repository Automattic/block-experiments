<?php

add_action( 'init', function() {
	register_block_type( 'jetpack/layout-grid', [
		'editor_script' => 'wpcom-blocks',
		'style' => 'wpcom-blocks',
		'editor_style' => 'wpcom-blocks-editor',
	] );

	register_block_type( 'jetpack/layout-grid-column', [
		'editor_script' => 'wpcom-blocks',
		'style' => 'wpcom-blocks',
		'editor_style' => 'wpcom-blocks-editor',
	] );
} );

add_action( 'wp_head', function() {
	wp_enqueue_style(
		'wpcom-layout-grid-front',
		plugins_url( 'front.css', __FILE__ ),
		[], // no dependencies
		filemtime( plugin_dir_path( __FILE__ ) . 'front.css' )
	);
} );
