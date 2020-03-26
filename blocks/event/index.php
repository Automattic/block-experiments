<?php

add_action( 'init', function() {
	register_block_type( 'jetpack/event', [
		'editor_script' => 'block-experiments',
		'style' => 'block-experiments',
		'editor_style' => 'block-experiments-editor',
	] );
} );
