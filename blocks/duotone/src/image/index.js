/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { image as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import deprecated from './deprecated';
import edit from './edit';
import metadata from './block.json';
import save from './save';
import transforms from './transforms';

const { name } = metadata;

export { metadata, name };

export const settings = {
	title: __( 'Duotone Image', 'duotone' ),
	description: __( 'Insert an image to make a visual statement.', 'duotone' ),
	icon,
	keywords: [
		'img', // "img" is not translated as it is intended to reflect the HTML <img> tag.
		__( 'photo', 'duotone' ),
		__( 'picture', 'duotone' ),
	],
	example: {
		attributes: {
			sizeSlug: 'large',
			url: 'https://s.w.org/images/core/5.3/MtBlanc1.jpg',
			// translators: Caption accompanying an image of the Mont Blanc, which serves as an example for the Image block.
			caption: __(
				'Mont Blanc appears—still, snowy, and serene.',
				'duotone'
			),
		},
	},
	styles: [
		{
			name: 'default',
			label: _x( 'Default', 'block style', 'duotone' ),
			isDefault: true,
		},
		{ name: 'rounded', label: _x( 'Rounded', 'block style', 'duotone' ) },
	],
	__experimentalLabel( attributes, { context } ) {
		if ( context === 'accessibility' ) {
			const { caption, alt, url } = attributes;

			if ( ! url ) {
				return __( 'Empty', 'duotone' );
			}

			if ( ! alt ) {
				return caption || '';
			}

			// This is intended to be read by a screen reader.
			// A period simply means a pause, no need to translate it.
			return alt + ( caption ? '. ' + caption : '' );
		}
	},
	getEditWrapperProps( attributes ) {
		return {
			'data-align': attributes.align,
		};
	},
	transforms,
	edit,
	save,
	deprecated,
};
