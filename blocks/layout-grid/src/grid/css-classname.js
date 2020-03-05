/**
 * Internal dependencies
 */

import { DEVICE_BREAKPOINTS, getSpanForDevice, getOffsetForDevice } from '../constants';
import { getDefaultSpan, getGridWidth } from './grid-defaults';

const getDevicelessSpanClassName = ( column, value ) => `column${ column + 1 }-grid__span-${ value }`;
const getDevicelessOffsetClassName = ( column, value ) => `column${ column + 1 }-grid__start-${ value }`;
const getDevicelessRowClassName = ( column, value ) => `column${ column + 1 }-grid__row-${ value }`;

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

/*
 * These are used in the editor which doesn't rely on CSS media queries, and so the classes need to be device agnostic
 */
export function getAsDeviceCSS( device, columns, attributes = {} ) {
	const values = getDeviceColumnClass( device, columns, attributes );
	const map = {
		span: getDevicelessSpanClassName,
		offset: getDevicelessOffsetClassName,
		row: getDevicelessRowClassName,
	};

	return convertClassesToObject( values, map );
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
	return {
		'wp-block-jetpack-layout-gutter__nowrap': ! addGutterEnds,
	};
}
