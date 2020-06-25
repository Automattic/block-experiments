/**
 * WordPress dependencies
 */

import { __ } from '@wordpress/i18n';
import { mobile, tablet, desktop } from '@wordpress/icons';

/**
 * @callback GetColumn
 * @param {Device} device - Device to change
 * @param {number} column - Column to change
 * @returns {Column}
 */

/**
 * @callback ChangeColumnCallback
 * @param {Device} device - Device to change
 * @param {number} column - Column to change
 * @param {Column} value - New column value
 */

/**
 * @typedef Column
 * @type
 * @property {number} start - Column start, relative to the row
 * @property {number} span - Column span
 * @property {number} row - Column row
 */

/**
 * @typedef ColumnAdjustment
 * @type
 * @property {number} [start] - Column start
 * @property {number} [span] - Column span
 * @property {number} [row] - Column row
 * @property {number} column - Column being adjusted
 */

/**
 * @typedef ColumnAttributes
 * @type
 * @property {number} startDesktop
 * @property {number} spanDesktop
 * @property {number} rowDesktop
 * @property {number} startMobile
 * @property {number} spanMobile
 * @property {number} rowMobile
 * @property {number} startTablet
 * @property {number} spanTablet
 * @property {number} rowTablet
 */

/**
 * @typedef ColumnDescription
 * @type
 * @property {string} label - Column label
 * @property {number} value - Number of columns
 */

/**
 * @typedef {"Desktop" | "Mobile" | "Tablet"} Device
 */

/**
 * @typedef DeviceBreakpoint
 * @type
 * @property {string} label - Device label
 * @property {Device} value - ID for this device
 * @property {ReactElement} icon - Icon for this device
 */

function getSpacingValues() {
	return [
		{ value: 'small', label: __( 'Small', 'layout-grid' ) },
		{ value: 'medium', label: __( 'Medium', 'layout-grid' ) },
		{ value: 'large', label: __( 'Large', 'layout-grid' ) },
		{ value: 'huge', label: __( 'Huge', 'layout-grid' ) },
	];
}

export const getPaddingValues = () =>
	[ { value: 'none', label: __( 'No padding', 'layout-grid' ) } ].concat(
		getSpacingValues()
	);

export const getGutterValues = () =>
	[ { value: 'none', label: __( 'No gutter', 'layout-grid' ) } ].concat(
		getSpacingValues()
	);

/**
 * Get column details
 * @returns {ColumnDescription[]}
 */
export const getColumns = () => [
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
];

/** @type {Device} */
export const DEVICE_DESKTOP = 'Desktop';

/** @type {Device} */
export const DEVICE_TABLET = 'Tablet';

/** @type {Device} */
export const DEVICE_MOBILE = 'Mobile';

/**
 * Get all the device breakpoints
 *
 * @returns {DeviceBreakpoint[]}
 */
export const getLayouts = () => [
	{
		value: DEVICE_DESKTOP,
		label: __( 'Desktop', 'layout-grid' ),
		icon: desktop,
	},
	{
		value: DEVICE_TABLET,
		label: __( 'Tablet', 'layout-grid' ),
		icon: tablet,
	},
	{
		value: DEVICE_MOBILE,
		label: __( 'Mobile', 'layout-grid' ),
		icon: mobile,
	},
];

/** @type {number} */
export const MAX_COLUMNS = 4;

/** @type {Device[]} */
export const DEVICE_BREAKPOINTS = [
	DEVICE_DESKTOP,
	DEVICE_TABLET,
	DEVICE_MOBILE,
];
