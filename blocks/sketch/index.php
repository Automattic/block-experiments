<?php
namespace Automattic\A8c\Plugins\Blocks\Sketch;

define( __NAMESPACE__ . '\DEFAULT_HEIGHT', 450);


function a8c_sketch_render( $attributes ) {
	$strokes = $attributes['strokes'] ?? [];
	$title   = $attributes['title'] ?? '';
	$height   = $attributes['height'] ?? DEFAULT_HEIGHT;
	$title_tag = $title ? sprintf( '<title>%s</title>', esc_html( $title ) ) : '';
	$supports_attributes = get_block_wrapper_attributes();

	if ( ! isset( $attributes['strokes'] ) || '' === $attributes['strokes'] ) {
		return '';
	}

	$paths = array_map(
		function( $stroke ) {
			if ( ! isset( $stroke['stroke'] ) || '' === $stroke['stroke'] ||
				! isset( $stroke['color'] ) || '' === $stroke['color'] ) {
				return '';
			}
			return sprintf(
				'<path fill="%s" d="%s" />',
				esc_attr( $stroke['color'] ),
				esc_attr( get_svg_path_from_stroke( $stroke['stroke'] ) )
			);
		},
		$strokes
	);

	$style = sprintf( 'style="height: %dpx;"', esc_attr( $height ) );

	$html =
		sprintf( '<figure %s %s>', $supports_attributes, $style ) .
			'<svg role="img">' .
				$title_tag .
				implode( "\n", $paths ) .
			'</svg>' .
		'</figure>';
	return $html;
}

function set_render_callback() {
	// Note that 'block-experiments' gets replaced with 'a8c-sketch' when bundling
	register_block_type(
		'a8c/sketch',
		[
			'editor_script' => 'block-experiments',
			'style' => 'block-experiments',
			'editor_style' => 'block-experiments-editor',
			'render_callback' => __NAMESPACE__ . '\a8c_sketch_render',
			'supports' => array(
				'align' => true,
			)
		]
	);
}

function get_svg_path_from_stroke( $stroke ) {
	if ( count( $stroke ) === 0 ) {
		return '';
	}

	$d = [];

	$p0 = $stroke[0];
	$p1 = $stroke[1];

	$d = array_merge( $d, [ 'M', $p0[0], $p0[1], 'Q' ] );

	$n_marks = count( $stroke );

	for ( $i = 1; $i < $n_marks; $i++ ) {

		$d  = array_merge(
			$d,
			[
				$p0[0],
				$p0[1],
				( $p0[0] + $p1[0] ) / 2,
				( $p0[1] + $p1[1] ) / 2,
			]
		);
		$p0 = $p1;
		$p1 = $stroke[ $i ];
	}

	$d[] = 'Z';

	return implode( ' ', $d );
}

add_action( 'init', __NAMESPACE__ . '\set_render_callback' );

