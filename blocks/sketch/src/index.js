/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import { BlockIcon as icon } from './icons';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

export const name = 'a8c/sketch';

const block = {
	apiVersion: 2,
	icon,
	attributes: {
		strokes: { type: 'array', default: [] },
	},
	supports: {
		align: true,
	},
	title: __( 'Sketch', 'a8c-sketch' ),
	category: 'a8c-blocks',
	description: _x(
		"“There's nothing more difficult than a line.” — Pablo Picasso",
		'Block description, based on a quote',
		'a8c-sketch'
	),
	keywords: [ __( 'Draw', 'a8c-sketch' ) ],
	edit,
	save,
};
export function registerBlock() {
	registerBlockType( name, block );
}
