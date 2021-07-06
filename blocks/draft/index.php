<?php
function draft_block_init() {
	register_block_type( 'jetpack/draft', [
		'editor_script' => 'block-experiments',
		'style' => 'block-experiments',
		'editor_style' => 'block-experiments-editor',
		'render_callback' => 'render_block_draft',
	]);
}
add_action( 'init', 'draft_block_init' );

function render_block_draft( $attributes, $content ) {
	if ( ! current_user_can( 'editor' ) && ! current_user_can( 'administrator' ) ) {
		return;
	}
	$draft_label = '<div class="wp-block-jetpack-draft__label">' . __( 'Draft content: only visible to editors' ) . '</div>';
	return $draft_label . $content;
}
