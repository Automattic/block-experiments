<?php

add_action( 'init', function() {
	register_block_type( 'a8c/duotone-filter', [
		'editor_script' => 'block-experiments',
		'style' => 'block-experiments',
		'editor_style' => 'block-experiments-editor',
	] );

	function is_supported_block( $block ) {
		$supported_blocks = [ 'core/image', 'core/cover' ];
		return in_array( $block['blockName'], $supported_blocks, true );
	}

	add_filter( 'render_block', function ( $block_content, $block ) {
		if (
			! is_supported_block( $block ) ||
			! array_key_exists( 'duotoneId', $block['attrs'] ) ||
			! array_key_exists( 'duotoneDark', $block['attrs'] ) ||
			! array_key_exists( 'duotoneLight', $block['attrs'] )
		) {
			return $block_content;
		}

		ob_start();
		include 'duotone.php';
		$duotone = ob_get_clean();

		return $duotone . $block_content;
	}, 10, 2 );
} );
