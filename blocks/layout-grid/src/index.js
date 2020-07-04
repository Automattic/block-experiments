/**
 * WordPress dependencies
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */

import editGrid from './grid/edit';
import saveGrid from './grid/save';
import editColumn from './grid-column/edit';
import saveColumn from './grid-column/save';
import { GridIcon, GridColumnIcon } from './icons';
import {
	getSpanForDevice,
	getOffsetForDevice,
	DEVICE_BREAKPOINTS,
	MAX_COLUMNS,
} from './constants';
import { getCategoryWithFallbacks } from '../../_helpers';

function getColumnAttributes( total, breakpoints ) {
	const attributes = {};

	for ( let index = 0; index < total; index++ ) {
		breakpoints.map( ( breakpoint ) => {
			attributes[ getSpanForDevice( index, breakpoint ) ] = {
				type: 'number',
			};
			attributes[ getOffsetForDevice( index, breakpoint ) ] = {
				type: 'number',
				default: 0,
			};
		} );
	}

	return attributes;
}

export function registerBlock() {
	registerBlockType( 'jetpack/layout-grid', {
		title: __( 'Layout Grid', 'layout-grid' ),
		description: __(
			'Align blocks to a global grid, with support for responsive breakpoints.',
			'layout-grid'
		),
		icon: GridIcon,
		category: getCategoryWithFallbacks( 'design', 'layout' ),
		supports: {
			align: [ 'full' ],
			html: false,
		},
		example: {
			attributes: {
				columns: 2,
			},
			innerBlocks: [
				{
					name: 'jetpack/layout-grid-column',
					innerBlocks: [
						{
							name: 'core/paragraph',
							attributes: {
								customFontSize: 32,
								content: __(
									'<strong>Snow Patrol</strong>',
									'layout-grid'
								),
								align: 'center',
							},
						},
					],
				},
				{
					name: 'jetpack/layout-grid-column',
					innerBlocks: [
						{
							name: 'core/image',
							attributes: {
								url:
									'https://s.w.org/images/core/5.3/Windbuchencom.jpg',
							},
						},
					],
				},
			],
		},
		attributes: {
			align: {
				type: 'string',
				default: 'full',
			},
			gutterSize: {
				type: 'string',
				default: 'large',
			},
			addGutterEnds: {
				type: 'boolean',
				default: true,
			},
			verticalAlignment: {
				type: 'string',
			},
			...getColumnAttributes( MAX_COLUMNS, DEVICE_BREAKPOINTS ),
		},
		edit: editGrid,
		save: saveGrid,
	} );

	registerBlockType( 'jetpack/layout-grid-column', {
		description: __(
			'A column used inside a Layout Grid block.',
			'layout-grid'
		),
		title: __( 'Column', 'layout-grid' ),
		icon: GridColumnIcon,
		category: getCategoryWithFallbacks( 'design', 'layout' ),
		parent: [ 'jetpack/layout-grid' ],
		supports: {
			inserter: false,
			reusable: false,
			html: false,
		},
		attributes: {
			backgroundColor: {
				type: 'string',
			},
			customBackgroundColor: {
				type: 'string',
			},
			padding: {
				type: 'string',
				default: 'none',
			},
			verticalAlignment: {
				type: 'string',
			},
		},
		edit: editColumn,
		save: saveColumn,
	} );
}
