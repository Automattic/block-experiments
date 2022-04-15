/**
 * External dependencies.
 */
/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';

/**
 * Register block type definition.
 */
export const registerBlock = () => {
	registerBlockType( 'a8c/definition', {
		apiVersion: 2,
		title: __( 'Definition', 'definition' ),
		description: __( 'A term and definition block.', 'definition' ),
		category: 'text',
		keywords: [ __( 'define', 'definition' ), __( 'term', 'definition' ) ],
		icon: 'book',
		attributes: {
			term: {
				type: 'string',
				source: 'html',
				selector: 'dfn',
				default: '',
			},
			definition: {
				type: 'string',
				source: 'html',
				selector: 'dd',
				default: '',
			},
			shouldShowTermMeta: {
				type: 'boolean',
				default: false,
			},
			isAbbreviation: {
				type: 'boolean',
				default: true,
			},
			partOfSpeech: {
				type: 'string',
				default: '',
			},
			phoneticTranscription: {
				type: 'string',
				default: '',
			},
		},
		/* styles: [
			{
				name: 'default',
				label: __( 'Default', 'definition' ),
				isDefault: true,
			},
			{
				name: 'minimal',
				label: __( 'Minimal', 'definition' ),
			},
		],*/
		example: {
			attributes: {
				term: __( 'Hot dog', 'definition' ),
				definition: __(
					'A hot dog (also spelled hotdog) is a food consisting of a grilled or steamed sausage served in the slit of a partially sliced bun.',
					'definition'
				),
			},
		},
		edit,
		save,
	} );
};
