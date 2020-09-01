<?php

add_action( 'init', function() {
	register_block_type( 'a8c/duotone-filter', [
		'editor_script' => 'block-experiments',
		'style' => 'block-experiments',
		'editor_style' => 'block-experiments-editor',
	] );

	function is_supported_block( $block ) {
		$supported_blocks = [ 'core/image', 'core/cover' ];
		return in_array( $block['blockName'], $supported_blocks );
	}

	function hex2rgb( $color ) {
		$color = trim( $color, '#' );
		if ( strlen( $color ) === 3 ) {
			$r = hexdec( substr( $color, 0, 1 ) . substr( $color, 0, 1 ) );
			$g = hexdec( substr( $color, 1, 1 ) . substr( $color, 1, 1 ) );
			$b = hexdec( substr( $color, 2, 1 ) . substr( $color, 2, 1 ) );
		} elseif ( strlen( $color ) === 6 ) {
			$r = hexdec( substr( $color, 0, 2 ) );
			$g = hexdec( substr( $color, 2, 2 ) );
			$b = hexdec( substr( $color, 4, 2 ) );
		} else {
			return array();
		}
		return array(
			'r' => $r / 255,
			'g' => $g / 255,
			'b' => $b / 255,
		);
	}

	add_filter( 'render_block', function ( $block_content, $block ) {
		if ( ! is_supported_block( $block ) ) {
			return $block_content;
		}

		$duotone_id = $block['attrs']['duotoneId'];
		$duotone_dark = hex2rgb( $block['attrs']['duotoneDark'] );
		$duotone_light = hex2rgb( $block['attrs']['duotoneLight'] );
		$duotone = <<<EOT
<svg
	xmlns:xlink="http://www.w3.org/1999/xlink"
	style="visibility: hidden !important; position: absolute !important; left: -9999px !important; overflow: hidden !important;"
	aria-hidden="true"
	focusable="false"
	role="none"
	>
	<defs>
		<filter id="$duotone_id">
			<feColorMatrix
				type="matrix"
				values=".2989 .5870 .1140 0 0
				        .2989 .5870 .1140 0 0
				        .2989 .5870 .1140 0 0
				        0 0 0 1 0"
			/>
			<feComponentTransfer color-interpolation-filters="sRGB">
				<feFuncR type="table" tableValues="{$duotone_dark['r']} {$duotone_light['r']}" />
				<feFuncG type="table" tableValues="{$duotone_dark['g']} {$duotone_light['g']}" />
				<feFuncB type="table" tableValues="{$duotone_dark['b']} {$duotone_light['b']}" />
			</feComponentTransfer>
		</filter>
	</defs>
</svg>
EOT; 
		return $block_content . $duotone;
	}, 10, 2 );
} );
