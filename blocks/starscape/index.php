<?php

add_action( 'init', function() {
	register_block_type( 'a8c/starscape', [
		'editor_script' => 'wpcom-blocks',
		'style' => 'wpcom-blocks',
		'editor_style' => 'wpcom-blocks-editor',
	] );

	wp_set_script_translations( 'a8c/starscape', 'starscape' );
} );
