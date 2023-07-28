/**
 * External dependencies
 */
import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';
import minifierPlugin from 'colord/plugins/minify';

extend( [ namesPlugin, minifierPlugin ] );

/**
 * Generate pseudo-random numbers from a seed using an LCG algorithm.
 *
 * LCG values selected from L'Ecuyer, Pierre Math. Comp. 68 (1999), 249-260.
 * @see {@link https://doi.org/10.1090%2FS0025-5718-99-00996-5}
 *
 * @param {number} seed Seed value (will be converted to 23-bit integer)
 *
 * @return {Generator<number>} Generator of random numbers between 0 and 1
 */
function* seededRandoms( seed ) {
	const modulus = 0x7fffffff;
	seed = ( seed >>> 0 ) % modulus;
	while ( true ) {
		seed = Math.imul( seed, 0x0034e7f7 ) % modulus;
		yield ( seed & modulus ) / modulus;
	}
}

/**
 * 32-bit FNV hash function.
 *
 * @param {ArrayBuffer} buffer Data to hash
 *
 * @return {number} 32-bit hash for the array
 */
function hashUint32( buffer ) {
	return new Uint32Array( buffer ).reduce(
		( hash, data ) => Math.imul( hash, 0x01000193 ) ^ data,
		0x811c9dc5
	);
}

/**
 * Generates a unique hash for the star box shadow arguments.
 *
 * @param {string} color Color option
 * @param {number} radius Radius option
 * @param {number} count Count option
 *
 * @return {number} 32-bit hash for the arguments
 */
function hashStarBoxShadowArgs( count, radius, color ) {
	const colorData = new TextEncoder().encode( color );
	const buffer = new ArrayBuffer(
		// 2 64-bit floats + color string + padding to 4-byte uint32 boundary.
		16 + colorData.byteLength + ( -colorData.byteLength & 3 )
	);
	new Float64Array( buffer, 0, 2 ).set( [ count, radius ] );
	new Uint8Array( buffer, 16 ).set( colorData );
	return hashUint32( buffer );
}

/**
 * Calculates points randomly within a circle so we don't bother calculating
 * for the points that will never appear on screen.
 *
 * @param {number} radius radius to randomly generate in
 *
 * @return {Object} Random { x, y } coordinates
 */
const randomPoint = ( radius, prng ) => {
	const a = prng.next().value * 2 * Math.PI;
	const r = radius * Math.sqrt( prng.next().value );

	return {
		x: r * Math.cos( a ),
		y: r * Math.sin( a ),
	};
};

/**
 * Calculate the box shadow. Optimized for shortest string length.
 *
 * @param {Object} options Options
 * @param {string} options.color CSS Color string
 * @param {number} options.density Quantity of stars in stars per million pixels
 * @param {number} options.areaWidth Max width of the area to fill in pixels
 * @param {number} options.areaHeight Max height of the area to fill in pixels
 */
const starBoxShadow = ( { color, density, areaWidth, areaHeight } ) => {
	// Any points outside the circle covering the rectangle, centered on the
	// midpoint of the bottom edge, won't be shown, so don't bother placing
	// any there.
	const base = areaWidth / 2;
	const height = areaHeight;
	const radius = Math.sqrt( base * base + height * height );

	// Star count calculation based on how dense the stars should be distributed
	// within our minimal circle
	const area = Math.PI * radius * radius;
	const count = Math.floor( area * density * 1e-6 );

	// Custom prng for deterministic results.
	const seed = hashStarBoxShadowArgs( count, radius, color );
	const prng = seededRandoms( seed );

	return Array.from( { length: count }, () => {
		const { x, y } = randomPoint( radius, prng );
		// Rounding to the nearest pixel saves up to 18% on string length
		return `${ Math.round( x ) }px ${ Math.round( y ) }px ${ color }`;
	} ).join( ',' );
};

/**
 * Calculates the style object in JS for the starscape stars.
 *
 * @param {Object} options Options
 * @param {number} options.starSize Size of star in pixels
 * @param {string} options.color CSS Color string
 * @param {number} options.density Value between 0 and 1
 * @param {number} options.areaWidth Maximum width the container may be in pixels
 * @param {number} options.areaHeight Maximum height the container may be in pixels
 *
 * @return {Object} CSS style object to add to a component
 */
const starBoxStyle = ( {
	starSize,
	color,
	density,
	areaWidth,
	areaHeight,
} ) => ( {
	boxShadow: starBoxShadow( { color, density, areaWidth, areaHeight } ),
	width: `${ starSize }px`,
	height: `${ starSize }px`,
} );

/**
 * Calculates the style object in JS for the starscape animation.
 *
 * @param {Object} options Options
 * @param {string} options.animation Type of animation (currently just `rotate`)
 * @param {number} options.duration Duration of animation in seconds
 *
 * @return {Object} CSS style object to add to a component
 */
const starBoxAnimation = ( { animation, duration } ) => ( {
	animation: `wp-block-a8c-starscape-animation-${ animation } ${ duration }s linear infinite`,
} );

/**
 * Calculate all three sizes of stars for saving in the attributes.
 *
 * @param {Object} options Options
 * @param {string} options.color CSS Color string for the stars
 * @param {number} options.density Range slider value between 1 and 100
 * @param {number} options.areaWidth Width in pixels that stars should be generated within
 * @param {number} options.areaHeight Height in pixels that stars should be generated within
 *
 * @return {Object[]} CSS style objects for each layer of stars
 */
export const genStars = ( {
	color: _color,
	density,
	areaWidth,
	areaHeight,
} ) => {
	// A little bit of minification goes a long way here since the color of each
	// individual star needs to be specified.
	const color = colord( _color ).minify( {
		hex: true,
		alphaHex: true,
		rgb: true,
		hsl: true,
		name: true,
		transparent: true,
	} );
	return [
		{
			starSize: 1,
			density: 4 * density + 10,
		},
		{
			starSize: 2,
			density: 2 * density + 10,
		},
		{
			starSize: 3,
			density: 1 * density + 10,
		},
	].map( ( variation ) =>
		starBoxStyle( {
			color,
			areaWidth,
			areaHeight,
			...variation,
		} )
	);
};

/**
 * Calculate all three sizes of stars for saving in the attributes.
 *
 * @param {Object} options Options
 * @param {number} options.speed Value between 1 and 100
 *
 * @return {Object[]} CSS style objects for each layer of stars
 */
export const genAnimations = ( { speed } ) =>
	[ 50000, 100000, 200000 ].map( ( duration ) =>
		starBoxAnimation( {
			animation: 'rotate',
			duration: duration / ( speed * speed ),
		} )
	);
