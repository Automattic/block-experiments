<?php
/**
 * Jazz it up!
 */

namespace Automattic\A8c\Plugins\Blocks\ModelViewer;


/**
 * Register the blocks.
 */
function create_block_3d_model_block_block_init() {

	register_block_type( 'a8c/model-viewer', [
		'script' => 'google-model-viewer',
		'editor_script' => 'block-experiments',
		'style' => 'block-experiments',
		'editor_style' => 'block-experiments-editor',
	] );

	wp_register_script(
		'google-model-viewer',
		plugins_url( 'model-viewer.min.js', __FILE__ ),
		[ 'wp-dom-ready' ], // no dependencies
		filemtime( plugin_dir_path( __FILE__ ) . 'model-viewer.min.js' ),
		true,
	);

	wp_set_script_translations( 'block-experiments', 'model-viewer' );
}
add_action( 'init', '\Automattic\A8c\Plugins\Blocks\ModelViewer\create_block_3d_model_block_block_init' );


function allow_media_uploads( array $types ): array {
	// @todo: figure out why content-type is being changed to
	// application/octet-stream on upload, instead of remaining as
	// model/gltf+json and model/gltf-binary.
	$types['gltf'] = 'application/octet-stream';
	$types['glb']  = 'application/octet-stream';

	return $types;
}

function add_script_type_attribute($tag, $handle, $src) {
	if ( 'google-model-viewer' !== $handle ) {
		return $tag;
	}

	$dom = new \DOMDocument();
	$dom->loadHTML( $tag );

	/** @var \DOMElement $script */
	$script = $dom->getElementsByTagName( 'script' )[0];
	$script->removeAttribute( 'async' );
	$script->removeAttribute( 'defer' );
	$script->setAttribute( 'type', 'module' );

	return $dom->saveHTML( $script );
}

function remove_upload_size_limit() {
	return 0;
}

add_filter( 'script_loader_tag', '\Automattic\A8c\Plugins\Blocks\ModelViewer\add_script_type_attribute' , 10, 3 );
add_filter( 'upload_mimes', '\Automattic\A8c\Plugins\Blocks\ModelViewer\allow_media_uploads', 10, 1 );
add_filter( 'upload_size_limit', '\Automattic\A8c\Plugins\Blocks\ModelViewer\remove_upload_size_limit', 10, 0 );