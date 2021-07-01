/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import { BlockIcon as icon } from './icons';
import example from './example';

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
		height: { type: 'number', default: 450 },
	},
	supports: {
		align: true,
	},
	title: __( 'Sketch', 'a8c-sketch' ),
	category: 'widgets',
	description: _x(
		'“Not a day without a line drawn.” — Apelles of Kos',
		'Block description, based on a quote',
		'a8c-sketch'
	),
	keywords: [ __( 'Draw', 'a8c-sketch' ) ],
	edit,
	save,
	example,
};
export function registerBlock() {
	registerBlockType( name, block );
}
