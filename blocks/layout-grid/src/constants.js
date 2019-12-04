/**
 * WordPress dependencies
 */

import { __ } from '@wordpress/i18n';

export const getPaddingValues = () => (	[
	{ value: 'none', label: __( 'No padding' ) },
	{ value: 'small', label: __( 'Small' ) },
	{ value: 'medium', label: __( 'Medium' ) },
	{ value: 'large', label: __( 'Large' ) },
	{ value: 'huge', label: __( 'Huge' ) },
] );

export const getColumns = () => ( [
	{
		label: __( '1 column' ),
		value: 1,
	},
	{
		label: __( '2 columns' ),
		value: 2,
	},
	{
		label: __( '3 columns' ),
		value: 3,
	},
	{
		label: __( '4 columns' ),
		value: 4,
	},
] );

export const DEVICE_DESKTOP = 'Desktop';
export const DEVICE_TABLET = 'Tablet';
export const DEVICE_MOBILE = 'Mobile';

export const getLayouts = () => ( [
	{ value: DEVICE_DESKTOP, label: __( 'Desktop' ) },
	{ value: DEVICE_TABLET, label: __( 'Tablet' ) },
	{ value: DEVICE_MOBILE, label: __( 'Mobile' ) },
] );

export const MAX_COLUMNS = 4;

export const DEVICE_BREAKPOINTS = [
	DEVICE_DESKTOP,
	DEVICE_TABLET,
	DEVICE_MOBILE,
];

export function getSpanForDevice( column, device ) {
	return `column${ column + 1 }${ device }Span`;
}

export function getOffsetForDevice( column, device ) {
	return `column${ column + 1 }${ device }Offset`;
}
