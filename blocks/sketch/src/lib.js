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
