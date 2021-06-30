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

	const d = [];

	let [ p0, p1 ] = stroke;

	d.push( 'M', p0[ 0 ], p0[ 1 ], 'Q' );

	for ( let i = 1; i < stroke.length; i++ ) {
		d.push(
			p0[ 0 ],
			p0[ 1 ],
			( p0[ 0 ] + p1[ 0 ] ) / 2,
			( p0[ 1 ] + p1[ 1 ] ) / 2
		);
		p0 = p1;
		p1 = stroke[ i ];
	}

	d.push( 'Z' );

	return d.join( ' ' );
}
