/**
 * External dependencies
 */

import classnames from 'classnames';

/**
 * Internal dependencies
 */

import { DEVICE_BREAKPOINTS } from './constants';
import { convertAttributesToColumn } from './grid-values';

/** @typedef {import('./constants.js').ColumnAttributes} ColumnAttributes */
/** @typedef {import('./constants.js').Device} Device */

/**
 * This removes our own CSS so we don't duplicate anything
 *
 * @param {string} className
 * @returns {string}
 */
function removeGridClasses( className ) {
	if ( ! className ) {
		return className;
	}

	return className
		.replace( /column\d-\w*-grid__\w*-\d*/g, '' )
		.replace( /column\d-grid__\w*-\d*/g, '' )
		.replace( /\s{2,}/, '' )
		.replace( /wp-block-jetpack-layout-gutter__\w*/, '' )
		.replace( /is-vertically-aligned-\w*/, '' )
		.replace( /are-vertically-aligned-\w*/, '' );
}

/**
 * Get classes for all columns on the device
 *
 * @param {Device} device - Selected device
 * @param {ColumnAttributes[]} columns - Attributes for all column
 * @returns {Object.<string,boolean>}
 */
export function getColumnClassesForEditor( device, columns ) {
	if ( ! columns || columns.length === 0 ) {
		return {};
	}

	return Object.assign.apply(
		{},
		columns.map( ( column, index ) =>
			getColumnClasses( column, `grid-column-${ index + 1 }__$grid-$position`, [ device ] )
		)
	);
}

function transformCssPattern( pattern, gridItem, gridPosition, device ) {
	return pattern
		.replace( '$grid', gridItem )
		.replace( '$position', gridPosition )
		.replace( '$device', device.toLowerCase() );
}

/**
 * Get classes for a column across all devices
 *
 * @param {ColumnAttributes} columnAttributes - Attributes for the column
 * @param {string} cssPattern - Pattern for the CSS name. Use `$grid` for the grid item (start, span, row), `$position` for the grid position, and `$device` for the device
 * @returns {Object.<string,boolean>}
 */
export function getColumnClasses( columnAttributes, cssPattern, devices = DEVICE_BREAKPOINTS ) {
	return Object.assign.apply(
		{},
		devices.map( ( device ) => {
			const { span, start, row } = convertAttributesToColumn( device, columnAttributes );

			return {
				// span is always present
				[ transformCssPattern( cssPattern, 'span', span, device ) ]: true,

				// start is always present, but is a value offset from the row
				[ transformCssPattern( cssPattern, 'start', start + 1, device ) ]: true,

				// row is only needed if not on the first row
				[ transformCssPattern( cssPattern, 'row', row + 1, device ) ]: row > 0,
			};
		} )
	);
}

/**
 * Get Layout Grid editor classes
 *
 * @param {string} device - Current editor device
 * @param {boolean} canResize - Can we resize the selected device at the current screen width?
 * @returns {Object.<string,boolean>}
 */
export function getGridEditorClasses( device, canResize ) {
	return {
		// Breakpoint
		'wp-block-jetpack-layout-tablet': device === 'Tablet',
		'wp-block-jetpack-layout-desktop': device === 'Desktop',
		'wp-block-jetpack-layout-mobile': device === 'Mobile',

		// Is this grid resizable on this screen size?
		'wp-block-jetpack-layout-resizable': canResize,
	};
}

/**
 * Get classes for the grid vertical alignment
 *
 * @param {string|null} verticalAlignment - Vertical alignment
 * @returns {Object.<string,boolean>}
 */
export function getGridVerticalAlignClasses( verticalAlignment ) {
	return {
		[ `are-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment && verticalAlignment !== 'top',
	};
}

/**
 * Get classes for the column vertical alignment
 *
 * @param {string|null} verticalAlignment - Vertical alignment
 * @returns {Object.<string,boolean>}
 */
export function getColumnVerticalAlignClasses( verticalAlignment ) {
	return {
		[ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment && verticalAlignment !== 'top',
	};
}

/**
 * Get vertical alignment for all the columns for the editor
 *
 * @param {ColumnAttributes[]} columns - Attributes for all column
 * @returns {Object.<string,boolean>}
 */
export function getColumnVerticalAlignEditorClasses( columns ) {
	if ( ! columns || columns.length === 0 ) {
		return {};
	}

	return Object.assign.apply(
		{},
		columns.map( ( column, index ) => ( {
			[ `grid-column-${ index + 1 }__valign-top` ]: column.verticalAlignment === 'top',
			[ `grid-column-${ index + 1 }__valign-center` ]: column.verticalAlignment === 'center',
			[ `grid-column-${ index + 1 }__valign-bottom` ]: column.verticalAlignment === 'bottom',
		} ) )
	);
}

/**
 * Get classes for the padding
 *
 * @param {string} padding - Padding size
 * @returns {Object.<string,boolean>}
 */
export function getPaddingClasses( padding ) {
	return {
		[ 'wp-block-jetpack-layout-grid__padding-' + padding ]: padding.length > 0,
	};
}

/**
 * Get classes for the gutter
 *
 * @param {boolean} addGutterEnds - Add gutter to the ends of the gried
 * @param {('none'|'small'|'medium'|'huge')} gutterSize - Gutter size
 * @returns {Object.<string,boolean>}
 */
export function getGutterClasses( addGutterEnds, gutterSize ) {
	return {
		'wp-block-jetpack-layout-gutter__nowrap': ! addGutterEnds,
		'wp-block-jetpack-layout-gutter__none': gutterSize === 'none',
		'wp-block-jetpack-layout-gutter__small': gutterSize === 'small',
		'wp-block-jetpack-layout-gutter__medium': gutterSize === 'medium',
		'wp-block-jetpack-layout-gutter__huge': gutterSize === 'huge',
	};
}

/**
 * Get classes for the background colour
 *
 * @param {string} backgroundColor - Background colour
 * @param {string} backgroundClass - Background class
 * @returns {Object.<string,boolean>}
 */
export function getBackgroundClasses( backgroundColor, backgroundClass ) {
	return {
		'has-background': backgroundColor,
		[ backgroundClass ]: backgroundClass,
	};
}

/**
 * Merge all column classes together along with the editor class name. Note this will remove existing Layout Grid classes
 *
 * @param {string} className - Existing editor className
 * @param {Object.<string,boolean>} extra - Any additional classes
 */
export function getGridClasses( className, extra ) {
	return classnames( removeGridClasses( className ), extra );
}
