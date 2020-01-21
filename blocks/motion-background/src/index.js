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
			mouseCurls: {
				type: 'integer',
				default: 10,
			},
			fluidSpeed: {
				type: 'integer',
				default: 4,
			},
			colorIntensity: {
				type: 'integer',
				default: 50,
			},
		},
		edit: ( props ) => <Edit { ...props } />,
		save: ( props ) => <Save { ...props } />,
	} );
};
