<?php

add_action( 'init', function() {
	register_block_type( 'jetpack/strike-that', [
		'editor_script' => 'wpcom-blocks',
		'style' => 'wpcom-blocks',
		'editor_style' => 'wpcom-blocks-editor',
	] );
} );
