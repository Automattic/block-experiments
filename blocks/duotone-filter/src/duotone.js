/**
 * WordPress dependencies
 */
import { SVG } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { hex2rgb } from './utils';

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
