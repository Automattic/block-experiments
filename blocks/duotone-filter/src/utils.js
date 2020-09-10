export const hex2rgb = ( color = '' ) => {
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
