/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import attributes from './attributes';
import save from './save';

export default {
	supports: {
		className: true,
		align: [ 'wide', 'full' ],
		color: {
			heading: true,
			text: true,
			link: true,
			background: false,
			gradients: false,
		},
		html: false,
		layout: {
			allowJustification: false,
		},
		spacing: {
			padding: true,
			margin: [ 'top', 'bottom' ],
			blockGap: true,
			__experimentalDefaultControls: {
				padding: true,
				blockGap: true,
			},
		},
	},
	attributes,
	save,
};
