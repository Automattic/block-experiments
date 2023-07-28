<?php
/**
 * Starscape Block.
 */

namespace Automattic\A8c\Plugins\Blocks\Starscape;

const FEATURE_NAME = 'starscape';
const BLOCK_NAME   = 'a8c/' . FEATURE_NAME;

/**
 * Registers the block for use in Gutenberg
 * This is done via an action so that we can disable
 * registration if we need to.
 */
function register_block() {
	register_block_type( BLOCK_NAME, [
		'editor_script' => 'block-experiments',
		'style' => 'block-experiments',
		'editor_style' => 'block-experiments-editor',
	] );

	wp_set_script_translations( 'block-experiments', 'starscape' );
}
add_action( 'init', __NAMESPACE__ . '\register_block' );
