/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { BookIcon } from './icon';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
export function registerBlock() {
	registerBlockType( 'a8c/book', {
		attributes: {
			author: {
				type: 'string',
			},
			height: {
				type: 'number',
			},
			imageId: {
				type: 'number',
			},
			imageUrl: {
				type: 'string',
				source: 'attribute',
				selector: 'img',
				attribute: 'src',
			},
			publisher: {
				type: 'string',
			},
			publicationDate: {
				type: 'string',
			},
			summary: {
				type: 'string',
			},
			title: {
				type: 'string',
			},
			width: {
				type: 'number',
			},
		},

		title: __( 'Book', 'a8c' ),
		description: __(
			'Show a book with cover and metadata such as author and publisher.',
			'a8c'
		),

		category: 'widgets',
		icon: BookIcon,

		supports: {
			// Removes support for an HTML mode.
			html: false,
			align: [ 'left', 'center', 'right' ],
			lightBlockWrapper: true,
		},

		edit: Edit,
		save,
	} );
}
