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
		example: {
			attributes: {
				eventTitle: 'Digging for Treasure',
				eventLocation: 'Treasure Island',
				eventStart: '1783-11-14T12:00:00',
				eventImageId: 1,
				eventImageURL:
					'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/TI-treasure.jpg/366px-TI-treasure.jpg',
				eventImageAlt: 'Treasure',
				focalPoint: {
					x: '0.30',
					y: '0.40',
				},
				customBackgroundColor: '#d4c5af',
				align: 'wide',
			},
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
