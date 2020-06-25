/**
 * WordPress dependencies
 */

import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */

import {
	getGridVerticalAlignClasses,
	getGutterClasses,
	getGridClasses,
} from '../grid-css';

export default function save( { attributes } ) {
	const { className, addGutterEnds, gutterSize, verticalAlignment } = attributes;
	const classes = getGridClasses( className, {
		...getGutterClasses( addGutterEnds, gutterSize ),
		...getGridVerticalAlignClasses( verticalAlignment ),
	} );

	return (
		<div className={ classes }>
			<InnerBlocks.Content />
		</div>
	);
};
