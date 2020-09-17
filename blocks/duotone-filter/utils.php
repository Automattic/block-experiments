<?php

if ( ! function_exists( 'hex2rgb' ) ) {
	function hex2rgb( $color ) {
		if ( strlen( $color ) === 4 ) {
			$r = hexdec( substr( $color, 1, 1 ) . substr( $color, 1, 1 ) );
			$g = hexdec( substr( $color, 2, 1 ) . substr( $color, 2, 1 ) );
			$b = hexdec( substr( $color, 3, 1 ) . substr( $color, 3, 1 ) );
		} elseif ( strlen( $color ) === 7 ) {
			$r = hexdec( substr( $color, 1, 2 ) );
			$g = hexdec( substr( $color, 3, 2 ) );
			$b = hexdec( substr( $color, 5, 2 ) );
		} else {
			return array();
		}

		return array(
			'r' => $r / 0xff,
			'g' => $g / 0xff,
			'b' => $b / 0xff,
		);
	}
}
