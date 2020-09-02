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
		$content = str_replace( 'autoplay muted', 'autoplay muted playsinline', $content );
	}

	if (
		isset( $attributes['duotoneId'] ) &&
		isset( $attributes['duotoneDark'] ) &&
		isset( $attributes['duotoneLight'] )
	) {
		ob_start();
		include __DIR__ . '/../duotone.php';
		$duotone = ob_get_clean();
		$content = $duotone . $content;
	}

	return $content;
}

/**
 * Registers the `a8c/duotone-cover` block.
 */
function register_block_a8c_duotone_cover() {
	register_block_type(
		'a8c/duotone-cover',
		array(
			'editor_script' => 'block-experiments',
			'style' => 'block-experiments',
			'editor_style' => 'block-experiments-editor',
			'render_callback' => 'render_block_a8c_duotone_cover',
		)
	);
}
add_action( 'init', 'register_block_a8c_duotone_cover' );
