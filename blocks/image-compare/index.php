<?php
/**
 * Plugin Name:  Image Compare Block
 * Plugin URI:   https://github.com/Auomattic/block-experiments
 * Description:  Adds a block to allowing side-by-side image comparison.
 * Version:      0.4.0
 * Author:       Automattic
 * Author URI:   https://automattic.com/
 * License:      GPL2
 * License URI:  https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:  juxtapose-block
 *
 * Uses modified source from JuxtaposeJS under MPLV2
 * https://github.com/NUKnightLab/juxtapose/
 *
 * @package ImageCompare_Block
 */

/**
 * Enqueue assets for editor and front-end view.
 */
add_action( 'enqueue_block_assets', function() {

	// Files.
	$juxtapose_js = '/assets/juxtapose.js';
	$juxtapose_css = '/assets/juxtapose.css';

	// Enqueue Juxtapose style.
	wp_enqueue_style(
		'juxtapose-css',
		plugins_url( $juxtapose_css, __FILE__ ),
		[],
		filemtime( plugin_dir_path( __FILE__ ) . $juxtapose_css )
	);

	// Enqueue Juxtapose JS.
	wp_enqueue_script(
		'juxtapose-js',
		plugins_url( $juxtapose_js, __FILE__ ),
		[ 'wp-dom-ready' ],
		filemtime( plugin_dir_path( __FILE__ ) . $juxtapose_js ),
		true // In footer.
	);
} );

