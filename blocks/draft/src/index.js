/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { pencil as icon } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';

registerBlockType( 'a8c/draft', {
	icon,
	edit,
	save,
} );

export function registerBlock() {
	registerBlockType( 'jetpack/draft', {
		title: __( 'Draft', 'draft' ),
		description: __(
			'A block for drafting post or page content, which can later be converted to individual blocks for more complex formatting.',
			'draft'
		),
		icon,
		category: 'text',
		supports: {
			html: true,
			align: false,
		},
		attributes: {
			content: {
				type: 'string',
				source: 'html',
				selector: 'section',
				multiline: 'p',
				default: '',
				__experimentalRole: 'content',
			},
		},
		edit,
		save,
	} );
}
