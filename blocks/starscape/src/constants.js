/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

export const gradients = {
	name: _x(
		'Starscape',
		'Indicates this palette comes from the starscape block.',
		'starscape'
	),
	gradients: [
		{
			name: __( 'Midnight', 'starscape' ),
			gradient:
				'linear-gradient(141deg, rgb(0, 0, 12) 0%,rgb(0, 0, 12) 100%)',
		},
		{
			name: __( 'Astronomical Dawn', 'starscape' ),
			gradient:
				'linear-gradient(141deg, rgb(2, 1, 17) 60%,rgb(32, 32, 44) 100%)',
		},
		{
			name: __( 'Nautical Dawn', 'starscape' ),
			gradient:
				'linear-gradient(141deg, rgb(2, 1, 17) 10%,rgb(58, 58, 82) 100%)',
		},
		{
			name: __( 'Civil Dawn', 'starscape' ),
			gradient:
				'linear-gradient(141deg, rgb(32, 32, 44) 0%,rgb(81, 81, 117) 100%)',
		},
		{
			name: __( 'Sunrise', 'starscape' ),
			gradient:
				'linear-gradient(141deg, rgb(32, 32, 44) 0%,rgb(111, 113, 170) 80%,rgb(138, 118, 171) 100%)',
		},
		{
			name: __( 'Morning', 'starscape' ),
			gradient:
				'linear-gradient(141deg, rgb(64, 64, 92) 0%,rgb(112, 114, 171) 50%,rgb(205, 130, 160) 100%)',
		},
		{
			name: __( 'Atmosphere', 'starscape' ),
			gradient:
				'linear-gradient(180deg, rgb(0, 0, 12) 65%,rgb(27, 39, 65) 85%,rgb(46, 68, 115) 95%,rgb(68, 99, 163) 100%)',
		},
		{
			name: __( 'Astronomical Dusk', 'starscape' ),
			gradient:
				'linear-gradient(141deg, rgb(11, 5, 11) 60%,rgb(39, 23, 28) 100%)',
		},
		{
			name: __( 'Nautical Dusk', 'starscape' ),
			gradient:
				'linear-gradient(141deg, rgb(11, 5, 11) 10%,rgb(76, 45, 47) 100%)',
		},
		{
			name: __( 'Civil Dusk', 'starscape' ),
			gradient:
				'linear-gradient(141deg, rgb(19, 15, 19) 0%,rgb(47, 33, 34) 50%,rgb(108, 53, 58) 100%)',
		},
		{
			name: __( 'Sunset', 'starscape' ),
			gradient:
				'linear-gradient(141deg, rgb(30, 24, 24) 0%,rgb(47, 33, 34) 30%,rgb(108, 53, 58) 70%,rgb(207, 128, 75) 100%)',
		},
		{
			name: __( 'Evening', 'starscape' ),
			gradient:
				'linear-gradient(141deg, rgb(47, 33, 34) 10%,rgb(108, 53, 58) 40%,rgb(207, 128, 75) 80%,rgb(255, 235, 89) 100%)',
		},
	],
};

export const colors = {
	name: _x(
		'Starscape',
		'Indicates this palette comes from the starscape block.',
		'starscape'
	),
	colors: [
		{
			name: __( 'Class O', 'starscape' ),
			color: '#ADE4FF',
		},
		{
			name: __( 'Class B', 'starscape' ),
			color: '#FEFEFF',
		},
		{
			name: __( 'Class A', 'starscape' ),
			color: '#FFFFD6',
		},
		{
			name: __( 'Class F', 'starscape' ),
			color: '#FFFE97',
		},
		{
			name: __( 'Class G', 'starscape' ),
			color: '#FEFF40',
		},
		{
			name: __( 'Class K', 'starscape' ),
			color: '#FF9940',
		},
		{
			name: __( 'Class M', 'starscape' ),
			color: '#C10000',
		},
	],
};

export const htmlElementMessages = {
	header: __(
		'The <header> element should represent introductory content, typically a group of introductory or navigational aids.'
	),
	main: __(
		'The <main> element should be used for the primary content of your document only. '
	),
	section: __(
		"The <section> element should represent a standalone portion of the document that can't be better represented by another element."
	),
	article: __(
		'The <article> element should represent a self-contained, syndicatable portion of the document.'
	),
	aside: __(
		"The <aside> element should represent a portion of a document whose content is only indirectly related to the document's main content."
	),
	footer: __(
		'The <footer> element should represent a footer for its nearest sectioning element (e.g.: <section>, <article>, <main> etc.).'
	),
};
