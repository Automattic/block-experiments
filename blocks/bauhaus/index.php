<?php
/**
 * Block to celebrate the Bauhaus centenary.
 *
 * @package Jetpack
 */

/**
 * Register the blocks.
 */
add_action( 'init', function() {
	register_block_type(
		'jetpack/bauhaus',
		[
			'editor_script'   => 'wpcom-blocks',
			'style'           => 'wpcom-blocks',
			'editor_style'    => 'wpcom-blocks-editor',
		]
	);
} );
