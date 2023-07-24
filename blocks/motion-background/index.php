<?php

namespace Automattic\A8c\Plugins\Blocks\MotionBackground;

const FEATURE_NAME = 'motion-background';
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
		'render_callback' => __NAMESPACE__ . '\load_assets',
	] );
}
add_action( 'init', __NAMESPACE__ . '\register_block' );

/**
 * Motion Background block registration/dependency declaration.
 *
 * @param array  $attr    Array containing the Motion Background block attributes.
 * @param string $content String containing the Motion Background block content.
 *
 * @return string
 */
function load_assets( $attr, $content ) {
	if ( is_admin() ) {
		return $content;
	}

	wp_enqueue_script(
		'a8c-twgl-js',
		plugins_url( 'twgl/twgl.js', __FILE__ ),
		[], // no dependencies
		filemtime( plugin_dir_path( __FILE__ ) . 'twgl/twgl.js' ),
		true // in footer
	);
	wp_enqueue_script(
		'a8c-' . FEATURE_NAME . '-js',
		plugins_url( 'motion-background.js', __FILE__ ),
		[ 'wpcom-twgl-js', 'lodash' ],
		filemtime( plugin_dir_path( __FILE__ ) . 'motion-background.js' ),
		true // in footer
	);

	return $content;
}
