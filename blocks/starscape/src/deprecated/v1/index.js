/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Save from './save';

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

/**
 * Deprecation for converting from RichText to InnerBlocks.
 *
 * @see https://github.com/Automattic/block-experiments/pull/334
 */
export default {
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
	migrate: ( attributes ) => {
		const {
			// Removed entirely.
			starStyles,
			animationStyles,

			// Moved to InnerBlocks heading.
			heading,
			textAlign,
			textColor,
			customTextColor,

			// Default changed.
			background,

			...commonAttributes
		} = attributes;

		const newAttributes = {
			...commonAttributes,

			// Existing attribute with different default.
			background: background ?? '#00000c',
		};

		const newInnerBlocks = [
			createBlock( 'core/heading', {
				// Top-level moved to InnerBlocks.
				content: heading,
				textAlign,
				style: {
					textColor,
					color: {
						text: customTextColor ?? '#ffffff',
					},
				},

				// Hard-coded in the old block styles.
				typography: {
					fontSize: '84px',
					lineHeight: '1.3',
				},
			} ),
		];

		return [ newAttributes, newInnerBlocks ];
	},
	save: ( props ) => <Save { ...props } />,
};
