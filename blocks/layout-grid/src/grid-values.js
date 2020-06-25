/**
 * Internal dependencies
 */

import { DEVICE_MOBILE, DEVICE_TABLET, DEVICE_BREAKPOINTS } from './constants';

/** @typedef {import('./constants.js').Device} Device */
/** @typedef {import('./constants.js').ColumnAttributes} ColumnAttributes */
/** @typedef {import('./constants.js').Column} Column */

/**
 * Get grid width for a device
 *
 * @param {Device} device - Device
 * @returns {number}
 */
export function getGridWidth( device ) {
	if ( device === DEVICE_TABLET ) {
		return 8;
	} else if ( device === DEVICE_MOBILE ) {
		return 4;
	}

	return 12;
}

/**
 * Get grid rows for a device
 *
 * @param {Device} device - Device
 * @returns {number}
 */
export const getGridRows = ( device ) => {
	if ( device === DEVICE_TABLET ) {
		return 2;
	} else if ( device === DEVICE_MOBILE ) {
		return 4;
	}

	return 1;
};

/**
 * Get default span for a column, given a device and number of columns
 *
 * - 1 column: desktop=1x12x1 tablet=1x8x1 mobile=1x4x1
 * - 2 column: desktop=2x6x1 tablet=2x4x1 mobile=1x4x2
 * - 3 column: desktop=3x4x1 tablet=2x4x1 + 1x8x1 mobile=1x4x3
 * - 4 column: desktop=4x3x1 tablet=2x4x2 mobile=1x4x4
 *
 * @param {Device} device - Device
 * @param {number} columns - Number of columns
 * @param {number} column - Current column
 * @returns {number}
 */
export function getDefaultSpan( device, columns, column ) {
	if ( device === DEVICE_TABLET ) {
		if ( columns === 3 && column === 2 ) {
			return getGridWidth( device );
		} else if ( columns > 1 ) {
			return getGridWidth( device ) / 2;
		}

		return getGridWidth( device );
	}

	if ( device === DEVICE_MOBILE ) {
		return getGridWidth( device );
	}

	return getGridWidth( device ) / columns;
}

/**
 * @param {Device} device
 * @param {ColumnAttributes} attributes
 * @returns {Column}
 */
export function convertAttributesToColumn( device, attributes ) {
	return {
		span: attributes[ `span${ device }` ] || 0,
		start: attributes[ `start${ device }` ] || 0,
		row: attributes[ `row${ device }` ] || 0,
	};
}

/**
 * @param {Device} device
 * @param {Column} column
 * @returns {ColumnAttributes} attributes
 */
export function convertColumnToAttributes( device, column ) {
	const { span, start, row } = column;

	return {
		[ `span${ device }` ]: span,
		[ `row${ device }` ]: row,
		[ `start${ device }` ]: start,
	};
}

/**
 * Get the row, treating `start` as a single row split into `maxWidth` individual rows
 * @param {number} start - Absolute start
 * @param {number} maxWidth - Maximum width of the grid for the device
 * @returns {number}
 */
function getGridRow( start, maxWidth ) {
	return Math.floor( start / maxWidth );
}

/**
 * Get the relative start position, treating `start` as a single row split into `maxWidth` individual rows
 *
 * @param {number} start - Absolute start
 * @param {number} maxWidth - Maximum width of the grid for the device
 * @returns {number}
 */
function getGridRowStart( start, maxWidth ) {
	return start % maxWidth;
}

/**
 * Get default layout for a number of columns on a particular device
 *
 * @param {number} totalColumns - Total number of columns
 * @param {number} columnNumber - Column number
 * @returns {ColumnAttributes}
 */
export function getDefaultColumnAttributes( totalColumns, columnNumber ) {
	return Object.assign.apply(
		{},
		DEVICE_BREAKPOINTS.map( ( device ) => {
			const span = getDefaultSpan( device, totalColumns, columnNumber );

			return convertColumnToAttributes( device, {
				span,
				row: getGridRow( span * columnNumber, getGridWidth( device ) ),
				start: getGridRowStart( span * columnNumber, getGridWidth( device ) ),
			} );
		} )
	);
}
