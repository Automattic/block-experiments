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
import { Icon } from './icons';
import Edit from './edit';
import Save from './save';

export function registerBlock() {
	registerBlockType( 'a8c/event', {
		title: __( 'Event' ),
		description: __( 'Show the time and location of an event.' ),
		icon: <Icon />,
		category: 'widgets',
		example: {},
		attributes: {
			eventTitle: {
				type: 'string',
			},
			eventLocation: {
				type: 'string',
			},
			eventStart: {
				type: 'string',
			},
			eventImage: {
				type: 'string',
			},
			eventImageAlt: {
				type: 'string',
				default: '',
			},
			backgroundColor: {
				type: 'string',
			},
			customBackgroundColor: {
				type: 'string',
			},
			textColor: {
				type: 'string',
			},
			customTextColor: {
				type: 'string',
			},
		},
		edit: Edit,
		save: Save,
	} );
}
