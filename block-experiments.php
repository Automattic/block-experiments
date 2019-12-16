<?php
/**
 * Plugin Name: Block Experiments
 * Plugin URI:  https://github.com/automattic/block-experiments
 * Description: A set of block experiments from the fine folks at Automattic
 * Version:     1.0.0
 * Author:      Automattic
 * Author URI:  https://automattic.com
 * Text Domain: wpcom-blocks
 * License:     GPL v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */

// Auto-load any blocks in the block directory. These will behave like seperate plugins and will need to activate themselves
$blocks = glob( dirname( __FILE__ ) . '/blocks/*', GLOB_ONLYDIR );

foreach ( $blocks as $block ) {
	if ( file_exists( $block . '/index.php' ) ) {
		include_once( $block . '/index.php' );
	}
}

add_action( 'init', function() {
	add_filter( 'wp_kses_allowed_html', function( $tags ) {
		$tags['svg'] = [
			'xmlns' => [],
			'fill' => [],
			'role' => [],
			'aria-hidden' => [],
			'focusable' => [],
			'style' => [],
			'height' => [],
			'width' => [],
			'viewbox' => [],
			'preserveaspectratio' => [],
		];

		$tags['path'] = [
			'class' => [],
			'd' => [],
			'opacity' => [],
			'fill' => [],
			'fillrule' => [],
			'fillopacity' => [],
			'transform' => [],
			'stroke' => [],
		];

		$tags['rect'] = [
			'd' => [],
			'opacity' => [],
			'fill' => [],
			'fillrule' => [],
			'transform' => [],
			'width' => [],
			'height' => [],
			'y' => [],
		];

		$tags['circle'] = [
			'class' => [],
			'cx' => [],
			'cy' => [],
			'r' => [],
		];

		$tags['polygon'] = [
			'points' => [],
			'fill' => [],
		];

		$tags['iframe'] = [
			'title' => [],
			'allowfullscreen' => [],
			'frameborder' => [],
			'width' => [],
			'height' => [],
			'src' => [],
		];

		return $tags;
	}, 10, 2);

	$asset_file   = plugin_dir_path( __FILE__ ) . 'build/index.asset.php';
	$asset        = file_exists( $asset_file )
		? require_once $asset_file
		: null;
	$dependencies = isset( $asset['dependencies'] ) ?
		$asset['dependencies'] :
		[];
	$version      = isset( $asset['version'] ) ?
		$asset['version'] :
		filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' );

	// Block JS
	wp_register_script(
		'wpcom-blocks',
		plugins_url( 'build/index.js', __FILE__ ),
		$dependencies,
		$version,
		true
	);

	// Block front end style
	wp_register_style(
		'wpcom-blocks',
		plugins_url( 'build/style.css', __FILE__ ),
		[],
		filemtime( plugin_dir_path( __FILE__ ) . 'build/style.css' )
	);

	// Block editor style
	wp_register_style(
		'wpcom-blocks-editor',
		plugins_url( 'build/editor.css', __FILE__ ),
		[],
		filemtime( plugin_dir_path( __FILE__ ) . 'build/editor.css' )
	);
} );
