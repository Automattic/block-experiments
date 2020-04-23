<?php

add_action( 'init', function() {
	register_block_type( 'a8c/event', [
		'editor_script' => 'block-experiments',
		'style' => 'block-experiments',
		'editor_style' => 'block-experiments-editor',
	] );

	wp_set_script_translations( 'a8c/event', 'event' );
} );
