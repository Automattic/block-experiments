<?php
/**
 * Block to celebrate the Bauhaus centenary.
 */

/**
 * Register the blocks.
 */
add_action( 'init', function() {
	register_block_type(
		'a8c/bauhaus-centenary',
		[
			'editor_script'   => 'block-experiments',
			'style'           => 'block-experiments',
			'editor_style'    => 'block-experiments-editor',
		]
	);

	wp_set_script_translations( 'a8c/bauhaus-centenary', 'bauhaus-centenary' );
} );
