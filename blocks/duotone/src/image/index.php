<?php
/**
 * Server-side rendering of the `a8c/duotone-image` block.
 *
 * @package WordPress
 */

/**
 * Server side render for `a8c/duotone-image`.
 *
 * @param array  $attributes The block attributes.
 * @param string $content HTML content of the block.
 *
 * @return string Rendered HTML of the referenced block.
 */
function render_block_a8c_duotone_image( $attributes, $content ) {
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
 * Registers the `a8c/duotone-image` block.
 */
function register_block_a8c_duotone_image() {
	register_block_type_from_metadata(
		__DIR__ . '/image',
		array(
			'render_callback' => 'render_block_a8c_duotone_image',
		)
	);
}
add_action( 'init', 'register_block_a8c_duotone_image' );
