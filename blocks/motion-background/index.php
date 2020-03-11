<?php

add_action( 'init', function() {
	register_block_type( 'a8c/motion-background', [
		'editor_script' => 'wpcom-blocks',
		'style' => 'wpcom-blocks',
		'editor_style' => 'wpcom-blocks-editor',
	] );
} );

add_action( 'enqueue_block_assets', function() {
	// https://github.com/WordPress/gutenberg/issues/14758#issuecomment-478912504
	function some_posts_have_block( $block_type ) {
		global $wp_the_query;
		foreach ( $wp_the_query->posts as $post ) {
			if ( has_block( $block_type, $post ) ) {
				return TRUE;
			}
		}
		return FALSE;
	}

	if ( ! is_admin() && some_posts_have_block( 'a8c/motion-background' ) ) {
		wp_enqueue_script(
			'wpcom-twgl-js',
			plugins_url( 'twgl/twgl.js', __FILE__ ),
			[], // no dependencies
			filemtime( plugin_dir_path( __FILE__ ) . 'twgl/twgl.js' ),
			true // in footer
		);
		wp_enqueue_script(
			'wpcom-motion-background-js',
			plugins_url( 'motion-background.js', __FILE__ ),
			[ 'wpcom-twgl-js', 'lodash' ],
			filemtime( plugin_dir_path( __FILE__ ) . 'motion-background.js' ),
			true // in footer
		);
	}
} );
