/**
 * Internal dependencies
 */

import { DEVICE_BREAKPOINTS, getSpanForDevice, getOffsetForDevice } from '../constants';
import { getDefaultSpan, getGridWidth } from './grid-defaults';

const getDevicelessSpanClassName = ( column, value ) => `column${ column + 1 }-grid__span-${ value }`;
const getDevicelessOffsetClassName = ( column, value ) => `column${ column + 1 }-grid__start-${ value }`;
const getDevicelessRowClassName = ( column, value ) => `column${ column + 1 }-grid__row-${ value }`;
const getDevicelessAlignmentClassName = ( column, value ) => `column${ column + 1 }-grid__valign-${ value }`;

const getDeviceSpanClassName = ( column, value, device ) => `column${ column + 1 }-${ device.toLowerCase() }-grid__span-${ value }`;
const getDeviceOffsetClassName = ( column, value, device ) => `column${ column + 1 }-${ device.toLowerCase() }-grid__start-${ value }`;
const getDeviceRowClassName = ( column, value, device ) => `column${ column + 1 }-${ device.toLowerCase() }-grid__row-${ value }`;

function convertOffsetsToPositions( totalColumns, device, attributes ) {
	const offsets = [];
	let position = 0;

	for ( let column = 0; column < totalColumns; column++ ) {
		const customSpanName = getSpanForDevice( column, device );
		const customOffsetName = getOffsetForDevice( column, device );
		const span = attributes[ customSpanName ] || getDefaultSpan( device, totalColumns, column );
		const offset = attributes[ customOffsetName ] || 0;

		// Position is the current position plus the offset
		offsets.push( {
			position: position + offset,
			span,
		} );

		// Move the position up by the offset and the width of the column
		position += offset;
		position += span;
	}

	return offsets;
}

/*
 * Converts a position into a row
 */
function getGridRow( position, maxWidth ) {
	return Math.floor( position / maxWidth );
}

/*
 * Converts a position into an offset from the start of a row
 */
function getGridRowStart( position, maxWidth ) {
	return position % maxWidth;
}

function getDeviceClass( name, column, value, device, enabled = true ) {
	return {
		name,
		column,
		value,
		device,
		enabled,
	};
}

function getDeviceColumnClass( device, columns, attributes ) {
	const classes = [];
	const width = getGridWidth( device );

	// Convert all the offsets into absolute positions. Treat it as one giant row
	const positions = convertOffsetsToPositions( columns, device, attributes );

	// Now go through and convert this to classes, converting the single row absolute positions into rows and row offsets
	for ( let index = 0; index < positions.length; index++ ) {
		const { span, position } = positions[ index ];
		const row = getGridRow( position, width );
		const offset = getGridRowStart( position, width );

		classes.push( getDeviceClass( 'span', index, span, device ) );
		classes.push( getDeviceClass( 'offset', index, offset + 1, device, offset > 0 ) );
		classes.push( getDeviceClass( 'row', index, row + 1, device ) );
	}

	return classes;
}

function convertClassesToObject( classes, map ) {
	const cssValues = {};

	classes
		.filter( ( item ) => item.enabled && map[ item.name ] )
		.map( ( item ) => cssValues[ map[ item.name ]( item.column, item.value, item.device ) ] = true );

	return cssValues;
}

/**
 * These are used in the editor which doesn't rely on CSS media queries, and so the classes need to be device agnostic
 *
 * @param {string} device - Device string
 * @param {number} columns - Number of columns
 * @param {object} attributes - Grid block attributes
 * @param {object[]} columnAttributes - Grid column block attributes
 */
export function getAsEditorCSS( device, columns, attributes = {}, columnAttributes = [] ) {
	const values = getDeviceColumnClass(
		device,
		columns,
		attributes
	);
	const map = {
		span: getDevicelessSpanClassName,
		offset: getDevicelessOffsetClassName,
		row: getDevicelessRowClassName,
	};

	// Apply column-specific alignment at the global level. This is because of the nested DOM inside the editor
	const columnAlignments = {};
	for ( let index = 0; index < columns; index++ ) {
		// If the column has a vertical alignment and it's not the same as the global one then add a CSS class
		if (
			columnAttributes[ index ].verticalAlignment &&
			columnAttributes[ index ].verticalAlignment !== attributes.verticalAlignment
		) {
			columnAlignments[
				getDevicelessAlignmentClassName(
					index,
					columnAttributes[ index ].verticalAlignment
				)
			] = true;
		}
	}

	return {
		...convertClassesToObject( values, map ),
		...columnAlignments,
	};
}

/*
 * These are used in the front end and need device-specific CSS
 */
export function getAsCSS( columns, attributes = {} ) {
	let classes = {};
	const map = {
		span: getDeviceSpanClassName,
		offset: getDeviceOffsetClassName,
		row: getDeviceRowClassName,
	};

	for ( let deviceIndex = 0; deviceIndex < DEVICE_BREAKPOINTS.length; deviceIndex++ ) {
		classes = {
			...classes,
			...convertClassesToObject( getDeviceColumnClass( DEVICE_BREAKPOINTS[ deviceIndex ], columns, attributes ), map ),
		};
	}

	if ( ! attributes.addGutterEnds ) {
		classes[ 'wp-block-jetpack-layout-gutter__nowrap' ] = true;
	}

	if ( attributes.verticalAlignment && attributes.verticalAlignment !== 'top' ) {
		classes[
			`are-vertically-aligned-${ attributes.verticalAlignment }`
		] = true;
	}

	return classes;
}

export function removeGridClasses( classes ) {
	if ( ! classes ) {
		return classes;
	}

	return classes
		.replace( /column\d-\w*-grid__\w*-\d*/g, '' )
		.replace( /column\d-grid__\w*-\d*/g, '' )
		.replace( /\s{2,}/, '' )
		.replace( /wp-block-jetpack-layout-gutter__\w*/, '' );
}

export function getGutterClasses( { gutterSize, addGutterEnds } ) {
	// Note that 'large' is the default and doesn't output any CSS class
	return {
		'wp-block-jetpack-layout-gutter__nowrap': ! addGutterEnds,
		'wp-block-jetpack-layout-gutter__none': gutterSize === 'none',
		'wp-block-jetpack-layout-gutter__small': gutterSize === 'small',
		'wp-block-jetpack-layout-gutter__medium': gutterSize === 'medium',
		'wp-block-jetpack-layout-gutter__huge': gutterSize === 'huge',
	};
}
