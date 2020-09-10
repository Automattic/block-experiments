/**
 * WordPress dependencies
 */
import { SVG } from '@wordpress/components';

const hex2rgb = ( color = '' ) => {
	let r = '0';
	let g = '0';
	let b = '0';

	if ( color.length === 4 ) {
		r = '0x' + color[ 1 ] + color[ 1 ];
		g = '0x' + color[ 2 ] + color[ 2 ];
		b = '0x' + color[ 3 ] + color[ 3 ];
	} else if ( color.length === 7 ) {
		r = '0x' + color[ 1 ] + color[ 2 ];
		g = '0x' + color[ 3 ] + color[ 4 ];
		b = '0x' + color[ 5 ] + color[ 6 ];
	} else {
		return {};
	}

	return {
		r: r / 0xff,
		g: g / 0xff,
		b: b / 0xff,
	};
};

function Duotone( { id: duotoneId, darkColor, lightColor, selector } ) {
	const duotoneDark = hex2rgb( darkColor );
	const duotoneLight = hex2rgb( lightColor );

	const stylesheet = `
${ selector } {
	filter: url( #${ duotoneId } );
}
`;

	return (
		<>
			<SVG
				xmlnsXlink="http://www.w3.org/1999/xlink"
				viewBox="0 0 0 0"
				width="0"
				height="0"
				focusable="false"
				role="none"
				style={ {
					visibility: 'hidden',
					position: 'absolute',
					left: '-9999px',
					overflow: 'hidden',
				} }
			>
				<defs>
					<filter id={ duotoneId }>
						<feColorMatrix
							type="matrix"
							// prettier-ignore
							values=".299 .587 .114 0 0
							        .299 .587 .114 0 0
							        .299 .587 .114 0 0
							        0 0 0 1 0"
						/>
						<feComponentTransfer colorInterpolationFilters="sRGB">
							<feFuncR
								type="table"
								tableValues={ `${ duotoneDark.r } ${ duotoneLight.r }` }
							/>
							<feFuncG
								type="table"
								tableValues={ `${ duotoneDark.g } ${ duotoneLight.g }` }
							/>
							<feFuncB
								type="table"
								tableValues={ `${ duotoneDark.b } ${ duotoneLight.b }` }
							/>
						</feComponentTransfer>
					</filter>
				</defs>
			</SVG>
			<style dangerouslySetInnerHTML={ { __html: stylesheet } } />
		</>
	);
}

export default Duotone;
