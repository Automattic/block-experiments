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
	registerBlockType( 'a8c/motion-background', {
		title: 'Motion Background',
		icon: 'awards',
		category: 'widgets',
		supports: {
			align: true,
		},
		attributes: {
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
			color1: {
				type: 'string',
				default: '#F00',
			},
			color2: {
				type: 'string',
				default: '#FF0',
			},
			color3: {
				type: 'string',
				default: '#0FF',
			},
			color4: {
				type: 'string',
				default: '#0F0',
			},
		},
		edit: ( props ) => <Edit { ...props } />,
		save: ( props ) => <Save { ...props } />,
	} );
};
