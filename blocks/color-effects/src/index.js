/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';

export const registerBlock = () => {
	registerBlockType( 'a8c/color-effects', {
		title: 'Color Effects',
		icon: 'awards',
		category: 'widgets',
		supports: {
			align: true,
			html: false,
		},
		attributes: {
			complexity: {
				type: 'integer',
				default: 16,
			},
			mouseSpeed: {
				type: 'integer',
				default: 25,
			},
			fluidSpeed: {
				type: 'integer',
				default: 25,
			},
			color1: {
				type: 'string',
			},
			color2: {
				type: 'string',
			},
			color3: {
				type: 'string',
			},
			color4: {
				type: 'string',
			},
			minHeight: {
				type: 'number',
			},
			minHeightUnit: {
				type: 'string',
			},
			previewImage: {
				type: 'string',
			},
		},
		edit: Edit,
		save: Save,
	} );
};
