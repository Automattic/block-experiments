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
		edit: ( props ) => <Edit { ...props } />,
		save: ( props ) => <Save { ...props } />,
	} );
};
