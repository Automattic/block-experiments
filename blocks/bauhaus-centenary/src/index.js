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
	registerBlockType( 'jetpack/bauhaus-centenary', {
		title: 'Bauhaus Centenary',
		description: __( 'Celebrate the centenary of the design school' ),
		icon: BauhausIcon,
		category: 'widgets',
		supports: {
			align: true,
		},
		attributes: {
			align: {
				type: 'string',
				default: 'center',
			},
			caption: {
				type: 'string',
			},
			height: {
				type: 'integer',
				default: 128,
			},
			category: {
				type: 'string',
			},
			fillColor: {
				type: 'string',
			},
			customFillColor: {
				type: 'string',
			},
			backgroundColor: {
				type: 'string',
			},
			customBackgroundColor: {
				type: 'string',
			},
			year: {
				type: 'string',
				default: '1919',
			},
			forms: {
				type: 'array',
				default: [
					{
						type: 'triangle',
						fill: '#F7FC1C',
						stroke: 'none',
					},
					{
						type: 'square',
						fill: '#D32121',
						stroke: 'none',
					},
					{
						type: 'circle',
						fill: '#051BF4',
						stroke: 'none',
					},
				],
			},
		},
		edit: ( props ) => <Edit { ...props } />,
		save: ( props ) => <Save { ...props } />,
	} );
};
