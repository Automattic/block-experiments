/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { icon } from './icon';
import Edit from './edit';
import Save from './save';

export const registerBlock = () => {
	registerBlockType( 'a8c/model-block', {
		title: '3d model viewer',
		description: __( 'Jazz it up!' ),
		category: 'widgets',
		icon,
		attributes: {
			id: {
				type: 'number',
			},
			src: {
				type: 'string',
				source: 'attribute',
				selector: 'model-viewer',
				attribute: 'src',
			},
			alt: {
				type: 'string',
				source: 'attribute',
				selector: 'model-viewer',
				attribute: 'alt',
				default: '',
			},
			width: {
				type: 'number',
			},
			height: {
				type: 'number',
			},
		},
		supports: {
			align: true,
		},
		edit: ( props ) => <Edit { ...props } />,
		save: ( props ) => <Save { ...props } />,
	} );
};
