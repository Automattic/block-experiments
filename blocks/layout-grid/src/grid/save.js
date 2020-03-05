/**
 * External dependencies
 */

import classnames from 'classnames';

/**
 * WordPress dependencies
 */

import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */

import { getAsCSS, removeGridClasses, getGutterClasses } from './css-classname';

const save = ( { attributes, innerBlocks } ) => {
	const {
		className,
	} = attributes;
	const extra = getAsCSS( innerBlocks.length, attributes );
	const classes = classnames(
		removeGridClasses( className ),
		extra,
		getGutterClasses( attributes ),
	);

	return (
		<div className={ classes }>
			<InnerBlocks.Content />
		</div>
	);
};

export default save;
