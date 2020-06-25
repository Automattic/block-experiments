/**
 * Internal dependencies
 */

import { InnerBlocks, getColorClassName } from '@wordpress/block-editor';
import {
	getPaddingClasses,
	getColumnVerticalAlignClasses,
	getBackgroundClasses,
	getGridClasses,
	getColumnClasses,
} from '../grid-css';

const save = ( { attributes = {} } ) => {
	const { className, backgroundColor, customBackgroundColor, padding, verticalAlignment } = attributes;
	const backgroundClass = getColorClassName( 'background-color', backgroundColor );
	const classes = getGridClasses( className, {
		...getPaddingClasses( padding ),
		...getColumnVerticalAlignClasses( verticalAlignment ),
		...getBackgroundClasses( backgroundColor, backgroundClass ),
		...getColumnClasses( attributes, 'grid-column-$device__$grid-$position' ),
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
