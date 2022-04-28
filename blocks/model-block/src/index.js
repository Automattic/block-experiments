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
		title: '3D Model',
		description: __( 'Show 3D models in an interactive viewer. Add files in .gltf or .glb formats.' ),
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
			autoRotate: {
				type: 'boolean',
				default: false,
			},
			width: {
				type: 'number',
			},
			widthUnit: {
				type: 'string',
			},
			height: {
				type: 'number',
			},
			heightUnit: {
				type: 'string',
			},
		},
		supports: {
			align: true,
		},
		edit: ( props ) => <Edit { ...props } />,
		save: ( props ) => <Save { ...props } />,
	} );
};
