<?php
/**
 * Server-side rendering of the `a8c/duotone-cover` block.
 *
 * @package WordPress
 */

/**
 * Supports `playsinline` attribute server side for `a8c/duotone-cover`.
 *
 * @param array  $attributes The block attributes.
 * @param string $content HTML content of the block.
 *
 * @return string Rendered HTML of the referenced block.
 */
function render_block_a8c_duotone_cover( $attributes, $content ) {
	if ( isset( $attributes['backgroundType'] ) && 'video' === $attributes['backgroundType'] ) {
		return str_replace( 'autoplay muted', 'autoplay muted playsinline', $content );
	}

	return $content;
}

/**
 * Registers the `a8c/duotone-cover` block.
 */
function register_block_a8c_duotone_cover() {
	register_block_type_from_metadata(
		__DIR__ . '/cover',
		array(
			'render_callback' => 'render_block_a8c_duotone_cover',
		)
	);
}
add_action( 'init', 'register_block_a8c_duotone_cover' );
