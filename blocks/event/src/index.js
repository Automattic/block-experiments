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
		title: __( 'Event', 'event' ),
		description: __( 'Show the time and location of an event.', 'event' ),
		icon: <Icon />,
		category: 'widgets',
		supports: {
			align: [ 'center', 'wide' ],
		},
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
			eventImageId: {
				type: 'number',
			},
			eventImageURL: {
				type: 'string',
			},
			eventImageAlt: {
				type: 'string',
				default: '',
			},
			focalPoint: {
				type: 'object',
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
