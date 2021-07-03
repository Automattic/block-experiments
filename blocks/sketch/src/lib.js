/**
 * External dependencies
 */
import _getStroke from 'perfect-freehand';

export const presets = [
	{
		size: 3,
		thinning: 0.3,
		smoothing: 0.83,
		streamline: 0.45,
	},
	{
		size: 14,
		thinning: 0.6,
		smoothing: 0.5,
		streamline: 0.75,
	},
	{
		size: 25,
		thinning: 0.5,
		smoothing: 0.5,
		streamline: 0.6,
	},
];

// Create SVG path data using the strokes from perfect-freehand.
export function getSvgPathFromStroke( stroke ) {
	if ( stroke.length === 0 ) return '';

	const d = stroke.reduce(
		( acc, [ x0, y0 ], i, arr ) => {
			const [ x1, y1 ] = arr[ ( i + 1 ) % arr.length ];
			acc.push( x0, y0, ( x0 + x1 ) / 2, ( y0 + y1 ) / 2 );
			return acc;
		},
		[ 'M', ...stroke[ 0 ], 'Q' ]
	);

	d.push( 'Z' );

	return d.join( ' ' );
}

/**
 *
 * Temporary fix for handling most of the crashes in Sfari when the user draws a single dot until we find a better solution
 * or perfect-freehand gets updated. See https://github.com/steveruizok/perfect-freehand/issues/11#issuecomment-873414323
 *
 * @param   {Array}   points
 * @param   {Object}  options
 * @return  {Array}   An arrray of points as returned by getStroke
 */
export function getStroke( points, options ) {
	if ( points.length < 3 ) {
		return _getStroke(
			[
				...points,
				[ points[ 0 ][ 0 ], points[ 0 ][ 1 ] + 1, points[ 0 ][ 2 ] ],
			],
			options
		);
	}
	const stroke = _getStroke( points, options );

	return stroke;
}
