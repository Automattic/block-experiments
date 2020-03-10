/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import BlockEdit from './motion-background-block/edit';
import BlockSave from './motion-background-block/save';
import CanvasProviderEdit from './motion-background-canvas-provider/edit';
import CanvasProviderSave from './motion-background-canvas-provider/save';

export const registerBlock = () => {
	registerBlockType( 'a8c/motion-background-container', {
		title: 'Motion Background Canvas Provider',
		icon: 'awards',
		category: 'widgets',
		supports: {
			html: false,
			multiple: false,
			align: [ 'full' ],
		},
		attributes: {
			align: {
				type: 'string',
				default: 'full',
			},
		},
		edit: CanvasProviderEdit,
		save: CanvasProviderSave,
	} );

	registerBlockType( 'a8c/motion-background', {
		title: 'Motion Background',
		icon: 'awards',
		category: 'widgets',
		parent: [ 'a8c/motion-background-container' ],
		supports: {
			align: true,
		},
		attributes: {
			align: {
				type: 'string',
				default: 'full',
			},
			textAlign: {
				type: 'string',
				default: 'center',
			},
			complexity: {
				type: 'integer',
				default: 32,
			},
			mouseSpeed: {
				type: 'integer',
				default: 2,
			},
			fluidSpeed: {
				type: 'integer',
				default: 4,
			},
			mode: {
				type: 'string',
				default: 'gradient',
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
			url: {
				type: 'string',
			},
			heading: {
				type: 'string',
			},
			textColor: {
				type: 'string',
			},
			customTextColor: {
				type: 'string',
				default: '#ffffff',
			},
		},
		edit: BlockEdit,
		save: BlockSave,
	} );
};
