/**
 * External dependencies
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

export function registerBlock() {
	registerBlockType( 'jetpack/strike-that', {
		title: __( 'Strike That' ),
		description: __( 'Cross something out.' ),
		icon: 'no',
		category: 'widgets',
		example: {},
		attributes: {
		},
		edit,
		save,
	} );
}
