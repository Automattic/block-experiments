/**
 * External dependencies
 */

import { times } from 'lodash';

/**
 * WordPress dependencies
 */

import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */

import { getDefaultColumnAttributes } from '../grid-values';

/**
 * Returns a grid of columns with the default layout applied to all columns (i.e. the columns equally fill the width for a device)
 *
 * @param {object[]} currentBlocks - Current blocks
 * @returns {object[]}
 */
export function setDefaultGridLayout( currentBlocks ) {
	const defaultColumns = times( currentBlocks.length, ( columnNumber ) =>
		getDefaultColumnAttributes( currentBlocks.length, columnNumber )
	);

	// Apply the device attributes for each column to the block
	return currentBlocks.map( ( block, columnNumber ) => ( {
		...block,
		attributes: {
			...block.attributes,
			...defaultColumns[ columnNumber ],
		},
	} ) );
}

/**
 * Adjust the number of columns, by adding new columns, or intelligently removing columns (priority given to empty ones)
 *
 * @param {object[]} innerBlocks - Current blocks
 * @param {number} columns - New number of columnrs
 * @returns {object[]}
 */
export function changeNumberOfColumns( innerBlocks, columns ) {
	if ( columns > innerBlocks.length ) {
		// Add to end
		return [
			...innerBlocks,
			...times( columns - innerBlocks.length, ( column ) => createBlock( 'jetpack/layout-grid-column' ) ),
		];
	}

	// Reverse the blocks so we start at the end. This happens in-place
	innerBlocks.reverse();

	// Remove empty blocks, then remove from the end
	let totalRemoved = 0;

	return innerBlocks
		.filter( ( block ) => {
			if ( totalRemoved < innerBlocks.length - columns && block.innerBlocks.length === 0 ) {
				totalRemoved++;
				return false;
			}

			return true;
		} )
		.slice( Math.max( 0, innerBlocks.length - columns - totalRemoved ) )
		.reverse();
}
