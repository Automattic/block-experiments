/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';
import { BauhausIcon } from './icon';

export const registerBlock = () => {
	registerBlockType( 'jetpack/bauhaus', {
		title: 'Bauhaus Centenary',
		description: __( 'Celebrate the centenary of the design school' ),
		icon: BauhausIcon,
		category: 'widgets',
		supports: {
			align: [ 'left', 'center', 'right' ],
		},
		attributes: {
			align: {
				type: 'string',
				default: 'center',
			},
			category: {
				type: 'string',
			},
			formsSquareFill: {
				type: 'string',
			},
			formsCircleFill: {
				type: 'string',
			},
			formsTriangleFill: {
				type: 'string',
			},
			formsSquareStroke: {
				type: 'string',
			},
			formsCircleStroke: {
				type: 'string',
			},
			formsTriangleStroke: {
				type: 'string',
			},
			formsBackgroundFill: {
				type: 'string',
			},
			formsSize: {
				type: 'string',
				default: 'medium',
			},
			yearFill: {
				type: 'string',
			},
			yearBackgroundFill: {
				type: 'string',
			},
			yearSize: {
				type: 'string',
				default: 'medium',
			},
			yearDisplay: {
				type: 'string',
				default: '1919',
			},
			ribbonFill: {
				type: 'string',
			},
			ribbonBackgroundFill: {
				type: 'string',
			},
			ribbonSize: {
				type: 'string',
				default: 'centered',
			},
		},
		edit: ( props ) => <Edit { ...props } />,
		save: ( props ) => <Save { ...props } />,
	} );
};
