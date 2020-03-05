/**
 * WordPress dependencies
 */

import { __ } from '@wordpress/i18n';

export const getPaddingValues = () => (	[
	{ value: 'none', label: __( 'No padding', 'layout-grid' ) },
	{ value: 'small', label: __( 'Small', 'layout-grid' ) },
	{ value: 'medium', label: __( 'Medium', 'layout-grid' ) },
	{ value: 'large', label: __( 'Large', 'layout-grid' ) },
	{ value: 'huge', label: __( 'Huge', 'layout-grid' ) },
] );

export const getColumns = () => ( [
	{
		label: __( '1 column', 'layout-grid' ),
		value: 1,
	},
	{
		label: __( '2 columns', 'layout-grid' ),
		value: 2,
	},
	{
		label: __( '3 columns', 'layout-grid' ),
		value: 3,
	},
	{
		label: __( '4 columns', 'layout-grid' ),
		value: 4,
	},
] );

export const DEVICE_DESKTOP = 'Desktop';
export const DEVICE_TABLET = 'Tablet';
export const DEVICE_MOBILE = 'Mobile';

export const getLayouts = () => ( [
	{ value: DEVICE_DESKTOP, label: __( 'Desktop', 'layout-grid' ) },
	{ value: DEVICE_TABLET, label: __( 'Tablet', 'layout-grid' ) },
	{ value: DEVICE_MOBILE, label: __( 'Mobile', 'layout-grid' ) },
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
