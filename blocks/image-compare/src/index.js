/**
 * Image Compare Block
 * A block that allows inserting side-by-side image comparison.
 */


/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { RichText } from '@wordpress/block-editor';
import { Path, SVG } from '@wordpress/primitives';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import edit from './edit';

export function registerBlock() {

	registerBlockType( 'jetpack/image-compare-block', {

		title: __( 'Image Compare' ),
		description: __(
			'Compare two images with a slider.'
		),

		icon: <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<Path d="M21 4h-6v1.5h6c.3 0 .5.2.5.5v.4l-3.6 3.5L15 8.1v1.8l2.6 1.7c.1.1.3.1.4.1.2 0 .4-.1.5-.2l3-2.9V18c0 .3-.2.5-.5.5h-6V20h6c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM1 6v12c0 1.1.9 2 2 2h10.5V4H3c-1.1 0-2 .9-2 2zm11 12.5H3c-.3 0-.5-.2-.5-.5v-1.4L5 14.7l1.5-1.1.1-.1 3 1.9c.1.1.3.1.4.1.2 0 .4-.1.5-.2L12 14v4.5zm0-6.6l-2.1 2L7 12c-.1-.1-.3-.1-.4-.1h-.1c-.1 0-.3.1-.4.1l-1.1.9-2.5 1.8V6c0-.3.2-.5.5-.5h9v6.4z" />
		</SVG>,

		category: 'layout',

		attributes: {
			imageBefore: {
				type: 'string',
				source: 'attribute',
				attribute: 'src',
				selector: '.image-compare__image-before',
			},
			imageAfter: {
				type: 'string',
				source: 'attribute',
				attribute: 'src',
				selector: '.image-compare__image-after',
			},
			caption: {
				type: 'string',
				source: 'html',
				selector: 'figcaption',
			},
			orientation: {
				type: 'string',
			}
		},

		example: {
			attributes: {
				imageBefore: 'https://upload.wikimedia.org/wikipedia/commons/archive/d/d8/20180325051241%21Lynda_Carter_Wonder_Woman.JPG',
				imageAfter: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Lynda_Carter_Wonder_Woman.JPG',
				caption: __( 'Wonder Woman' ),
			},
		},

		edit,

		save: ({ attributes }) => {
			return (
				<>
					<figure className="juxtapose" data-mode={ attributes.orientation }>
						<img alt={ __( 'Comparison image 1' ) } src={ attributes.imageBefore } className="image-compare__image-before" />
						<img alt={ __( 'Comparison image 2' ) } src={ attributes.imageAfter } className="image-compare__image-after" />
					</figure>
					{ ! RichText.isEmpty( attributes.caption ) && (
						<RichText.Content tagName="figcaption" value={ attributes.caption } />
					) }
				</>
			);
		}
	});
};
