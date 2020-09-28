/**
 * Calculates points randomly within a circle so we don't bother calculating
 * for the points that will never appear on screen.
 *
 * @param {number} radius radius to randomly generate in
 *
 * @return {Object} Random { x, y } coordinates
 */
const randomPoint = ( radius ) => {
	/* eslint-disable no-restricted-syntax */
	const a = Math.random() * 2 * Math.PI;
	const r = radius * Math.sqrt( Math.random() );
	/* eslint-enable no-restricted-syntax */

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
 * @param {number} options.maxWidth Max width of the area to fill in pixels
 * @param {number} options.maxHeight Max height of the area to fill in pixels
 */
const starBoxShadow = ( { color, density, maxWidth, maxHeight } ) => {
	// Any points outside the circle covering the rectangle, centered on the
	// midpoint of the bottom edge, won't be shown, so don't bother placing
	// any there.
	const base = maxWidth / 2;
	const height = maxHeight;
	const radius = Math.sqrt( base * base + height * height );

	// Star count calculation based on how dense the stars should be distributed
	// within our minimal circle
	const area = Math.PI * radius * radius;
	const count = Math.floor( area * density * 1e-6 );

	return Array.from( { length: count }, () => {
		const { x, y } = randomPoint( radius );
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
 * @param {number} options.maxWidth Maximum width the container may be in pixels
 * @param {number} options.maxHeight Maximum height the container may be in pixels
 *
 * @return {Object} CSS style object to add to a component
 */
const starBoxStyle = ( {
	starSize,
	color,
	density,
	maxWidth,
	maxHeight,
} ) => ( {
	boxShadow: starBoxShadow( { color, density, maxWidth, maxHeight } ),
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
 * @param {number} options.density Range slider value between 1 and 100
 * @param {number} options.maxWidth Width in pixels that stars should be generated within
 * @param {number} options.maxHeight Height in pixels that stars should be generated within
 *
 * @return {Object[]} CSS style objects for each layer of stars
 */
export const genStars = ( { density, maxWidth, maxHeight } ) =>
	[
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
			color: 'hsla(0, 100%, 100%, 0.8)',
			maxWidth,
			maxHeight,
			...variation,
		} )
	);

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
