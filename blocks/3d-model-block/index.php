<?php
/**
 * Jass it up!
 */

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
add_action( 'init', 'create_block_3d_model_block_block_init' );
