<?php

require_once __DIR__ . '/rest-api.php';

add_action( 'init', function() {
	register_block_type( 'jetpack/rich-image', [
		'editor_script' => 'block-experiments',
		'style' => 'block-experiments',
		'editor_style' => 'block-experiments-editor',
	] );
} );

add_action( 'rest_api_init', function() {
	Rich_Image_REST_API::init();
} );
