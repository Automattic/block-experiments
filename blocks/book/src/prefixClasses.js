/**
 * The name of the class which represents the base for all the styles
 * on this block.
 */
const CSS_NAMESPACE = 'wp-block-a8c-book';

/**
 * Function that prefixes the given classes with the CSS_NAMESPACE. The idea is to
 * avoid having to write the basename all the time, which is required by the BEM standard.
 *
 * @param {String} classes  -- A string of classnames to be prefixed with the base name.
 */
export default function prefixClasses( classes ) {
	return classes
		.split( ' ' )
		.map( ( name ) => `${ CSS_NAMESPACE }${ name }` )
		.join( ' ' );
}
