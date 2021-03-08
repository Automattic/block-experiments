<?php

// Note that 'block-experiments' gets replaced with 'jetpack-layout-grid' when bundling
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

	wp_set_script_translations( 'block-experiments', 'layout-grid' );
} );
