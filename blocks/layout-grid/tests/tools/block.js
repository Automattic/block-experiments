/**
 * External dependencies
 */

import fs from 'fs';

/**
 * Internal dependencies
 */
import '../../front.css';
import './style.css';

// TODO: it would be better if we could generate scss => css directly here

/**
 * List of themes with their CSS file
 */
const THEMES = {
	twentytwenty: 'https://themes.svn.wordpress.org/twentytwenty/1.4/style.css',
};

/**
 * Get a theme URL from a theme name
 *
 * @param {string} theme - Theme name
 * @return {string} Theme URL
 */
function getTheme( theme ) {
	if ( THEMES[ theme ] ) {
		return THEMES[ theme ];
	}

	return THEMES.twentytwenty;
}

/**
 * Return a block embedded within a WP post.
 *
 * @param {Object} props - Component props
 * @param {string} props.blockHTML - The block HTML
 */
export function Block( props ) {
	const { blockHTML } = props;

	return (
		<div
			className="entry-content"
			dangerouslySetInnerHTML={ { __html: blockHTML } }
		/>
	);
}

/**
 * Render content within a fake WP themes
 *
 * @param {Object} props - Component props
 * @param {Object} props.children - The content to render in the theme
 * @param {string} props.theme - Theme name
 */
export function Theme( props ) {
	const { children, theme } = props;

	return (
		<>
			<link rel="stylesheet" type="text/css" href={ getTheme( theme ) } />

			<main id="site-content" role="main">
				<article className="post type-post format-standard">
					<div className="post-inner thin">{ children }</div>
				</article>
			</main>
		</>
	);
}

/**
 * Utility function to dump the content of the psuedo browser to a file, to help with debugging.
 *
 * @param {string} filename - Target file name
 */
export function dumpHTML( filename ) {
	fs.writeFileSync( filename, document.documentElement.outerHTML );
}

export function isValid( block ) {
	return (
		block.isValid &&
		( block.innerBlocks
			? block.innerBlocks.filter( ( filt ) => ! filt.isValid ).length ===
			  0
			: true )
	);
}
