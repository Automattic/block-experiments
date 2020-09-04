/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/** @typedef {import('@wordpress/blocks').WPBlockVariation} WPBlockVariation */

/**
 * Internal dependencies
 */
import ColumnIcon from './../icons';
/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = [
	{
		name: 'one-column',
		title: __( 'One' ),
		description: __( 'One column', 'layout-grid' ),
		icon: ( <ColumnIcon columns={ 1 } /> ),
		isDefault: true,
		innerBlocks: [ [ 'jetpack/layout-grid-column' ] ],
		scope: [ 'block' ],
	},
	{
		name: 'two-columns',
		title: __( 'Two' ),
		description: __( 'Two columns', 'layout-grid' ),
		icon: ( <ColumnIcon columns={ 2 } /> ),
		innerBlocks: [
			[ 'jetpack/layout-grid-column' ],
			[ 'jetpack/layout-grid-column' ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'three-columns',
		title: __( 'Three' ),
		description: __( 'Three columns', 'layout-grid' ),
		icon: ( <ColumnIcon columns={ 3 } /> ),
		innerBlocks: [
			[ 'jetpack/layout-grid-column' ],
			[ 'jetpack/layout-grid-column' ],
			[ 'jetpack/layout-grid-column' ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'four-columns',
		title: __( 'Four' ),
		description: __( 'Four columns', 'layout-grid' ),
		icon: ( <ColumnIcon columns={ 4 } /> ),
		innerBlocks: [
			[ 'jetpack/layout-grid-column' ],
			[ 'jetpack/layout-grid-column' ],
            [ 'jetpack/layout-grid-column' ],
            [ 'jetpack/layout-grid-column' ],
		],
		scope: [ 'block' ],
	},
];

export default variations;
