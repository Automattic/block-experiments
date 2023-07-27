/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import StarsIcon from './icon';
import attributes from './attributes';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';

export function registerBlock() {
	registerBlockType( 'a8c/starscape', {
		title: __( 'Starscape', 'starscape' ),
		description: __( 'Create content with stars in motion.', 'starscape' ),
		icon: <StarsIcon />,
		category: 'widgets',
		supports: {
			className: true,
			align: [ 'wide', 'full' ],
			color: {
				heading: true,
				text: true,
				link: true,
				background: false,
				gradients: false,
			},
			html: false,
			layout: {
				allowJustification: false,
			},
			spacing: {
				padding: true,
				margin: [ 'top', 'bottom' ],
				blockGap: true,
				__experimentalDefaultControls: {
					padding: true,
					blockGap: true,
				},
			},
		},
		attributes,
		edit,
		save,
		deprecated,
	} );
}
