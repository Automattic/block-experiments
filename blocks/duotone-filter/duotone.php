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

// phpcs:disable
$duotone_id = $block['attrs']['duotoneId'];
$duotone_selector = '.wp-block-image.' . $duotone_id . ' > img';
$duotone_url = '#' . $duotone_id;
$duotone_dark = hex2rgb( $block['attrs']['duotoneDark'] );
$duotone_light = hex2rgb( $block['attrs']['duotoneLight'] );
// phpcs:enable

?>

<style>
	<?php echo $duotone_selector; ?> {
		filter: url( <?php echo $duotone_url; ?> );
	}
</style>

<svg
	xmlns:xlink="http://www.w3.org/1999/xlink"
	viewBox="0 0 0 0"
	width="0"
	height="0"
	focusable="false"
	role="none"
	style="visibility: hidden; position: absolute; left: -9999px; overflow: hidden;"
>
	<defs>
		<filter id="<?php echo $duotone_id; ?>">
			<feColorMatrix
				type="matrix"
				<?php // phpcs:disable ?>
				values=".2989 .5870 .1140 0 0
				        .2989 .5870 .1140 0 0
				        .2989 .5870 .1140 0 0
				        0 0 0 1 0"
				<?php // phpcs:enable ?>
			/>
			<feComponentTransfer color-interpolation-filters="sRGB">
				<feFuncR type="table" tableValues="<?php echo $duotone_dark['r']; ?> <?php echo $duotone_light['r']; ?>" />
				<feFuncG type="table" tableValues="<?php echo $duotone_dark['g']; ?> <?php echo $duotone_light['g']; ?>" />
				<feFuncB type="table" tableValues="<?php echo $duotone_dark['b']; ?> <?php echo $duotone_light['b']; ?>" />
			</feComponentTransfer>
		</filter>
	</defs>
</svg>
