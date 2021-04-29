<?php
namespace Automattic\A8c\Plugins\Blocks\Sketch;

function a8c_sketch_render( $attributes ) {
	$strokes = $attributes['strokes'] ?? [];
	$align   = $attributes['align'] ?? '';
	// The class name that affects alignment is called alignwide, alignfull, etc
	$align = $align ? " align$align" : '';

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

	$html =
		'<figure class="wp-block-a8c-sketch' . esc_attr( $align ) . '">' .
			'<svg>' .
				implode( "\n", $paths ) .
			'</svg>' .
		'</figure>';
	return $html;
}

function set_render_callback() {
	register_block_type(
		'a8c/sketch',
		[
			'render_callback' => __NAMESPACE__ . '\a8c_sketch_render',
		]
	);
}

add_action( 'init', __NAMESPACE__ . '\set_render_callback' );


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
