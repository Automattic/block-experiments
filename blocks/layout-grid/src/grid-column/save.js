/**
 * External dependencies
 */

import classnames from 'classnames';

/**
 * Internal dependencies
 */

import { InnerBlocks, getColorClassName } from '@wordpress/block-editor';

const save = ( { attributes = {} } ) => {
	const {
		className,
		backgroundColor,
		customBackgroundColor,
		padding,
	} = attributes;
	const backgroundClass = getColorClassName( 'background-color', backgroundColor );
	const classes = classnames( className, {
		[ 'wp-block-jetpack-layout-grid__padding-' + padding ]: true,
		'has-background': backgroundColor,
		[ backgroundClass ]: backgroundClass,
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

export default save;
