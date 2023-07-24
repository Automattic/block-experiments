/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import StarsIcon from './icon';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';

import generated from './generated.json';

// Generates the default value saved in generated.json
//
// import { genAnimations, genStars } from './utils';
// window.generate = () => JSON.stringify(
// 	{
// 		starStyles: genStars( { density: 20, maxWidth: 1920, maxHeight: 1080 } ),
// 		animationStyles: genAnimations( { speed: 20 } ),
// 	},
// 	null,
// 	'\t'
// );

export function registerBlock() {
	registerBlockType( 'a8c/starscape', {
		title: __( 'Starscape', 'starscape' ),
		description: __( 'Create content with stars in motion.', 'starscape' ),
		icon: <StarsIcon />,
		category: 'widgets',
		supports: {
			html: false,
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
			density: {
				type: 'int',
				default: 20,
			},
			speed: {
				type: 'int',
				default: 20,
			},
			maxWidth: {
				type: 'int',
				default: 1920,
			},
			maxHeight: {
				type: 'int',
				default: 1080,
			},
			starStyles: {
				type: 'array',
				default: generated.starStyles,
			},
			animationStyles: {
				type: 'array',
				default: generated.animationStyles,
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
			background: {
				type: 'string',
				default: '#00000c',
			},
		},
		edit,
		save,
		deprecated,
	} );
}
