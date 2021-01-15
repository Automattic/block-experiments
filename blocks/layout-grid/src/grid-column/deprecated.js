/**
 * External dependencies
 */

import classnames from 'classnames';

/**
 * WordPress dependencies
 */

import { InnerBlocks, getColorClassName } from '@wordpress/block-editor';

// This is the old version of the save function, that doesn't add a `has-background` for custom colours
const save = ( { attributes = {} } ) => {
	const {
		className,
		backgroundColor,
		customBackgroundColor,
		padding,
		verticalAlignment,
	} = attributes;
	const backgroundClass = getColorClassName(
		'background-color',
		backgroundColor
	);
	const classes = classnames( className, {
		[ 'wp-block-jetpack-layout-grid__padding-' + padding ]: true,
		'has-background': backgroundColor,
		[ backgroundClass ]: backgroundClass,
		[ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
	} );
	const style = {
		backgroundColor: backgroundClass ? undefined : customBackgroundColor,
	};

	return (
		<div className={ classes } style={ style }>
			<InnerBlocks.Content />
		</div>
	);
};

const deprecated = [
	// Versions < 1.3.1 didn't save `is-background` for custom background colours. This is a deprecation that transforms the old to the new
	{
		attributes: {
			backgroundColor: {
				type: 'string',
			},
			customBackgroundColor: {
				type: 'string',
			},
			padding: {
				type: 'string',
				default: 'none',
			},
			verticalAlignment: {
				type: 'string',
			},
		},
		save,
	},
];

export default deprecated;
