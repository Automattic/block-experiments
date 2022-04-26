<?php
/**
 * Jazz it up!
 */

namespace Automattic\A8c\Plugins\Blocks\ModelViewer;

/**
 * Register the blocks.
 */
function create_block_3d_model_block_block_init() {
	register_block_type( 'a8c/3d-model-block', [
		'editor_script' => 'block-experiments',
		'style' => 'block-experiments',
		'editor_style' => 'block-experiments-editor',
	] );

	wp_set_script_translations( 'block-experiments', '3d-mopdel-block' );
}
add_action( 'init', '\Automattic\A8c\Plugins\Blocks\ModelViewer\create_block_3d_model_block_block_init' );


function allow_media_uploads( array $types ): array {
	$types['gltf'] = 'model/gltf+json';
	$types['glb']  = 'model/gtlf+binary';

	return $types;
}

add_filter( 'upload_mimes', '\Automattic\A8c\Plugins\Blocks\ModelViewer\allow_media_uploads', accepted_args: 1, priority: 10 );
