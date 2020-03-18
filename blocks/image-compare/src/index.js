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

		icon: <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<Path d="M3 5v14c0 1.1.9 2 2 2h8.5V3H5c-1.1 0-2 .9-2 2zm9 14.5H5c-.3 0-.5-.2-.5-.5v-2.4l4.1-3 3 1.9c.1.1.3.1.4.1v3.9zm0-5.7L9 12c-.1-.1-.3-.1-.4-.1-.2 0-.3 0-.4.1l-3.6 2.6V5c0-.3.2-.5.5-.5h7v9.3zM19 3h-4v1.5h4c.3 0 .5.2.5.5v14c0 .3-.2.5-.5.5h-4V21h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
		</SVG>,

		category: 'layout',

		attributes: {
			imageBefore: {
				type: 'string',
				source: 'attribute',
				attribute: 'src',
				selector: '.imgBefore',
			},
			imageAfter: {
				type: 'string',
				source: 'attribute',
				attribute: 'src',
				selector: '.imgAfter',
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
						<img src={ attributes.imageBefore } className="imgBefore" />
						<img src={ attributes.imageAfter } className="imgAfter" />
					</figure>
					{ ! RichText.isEmpty( attributes.caption ) && (
						<RichText.Content tagName="figcaption" value={ attributes.caption } />
					) }
				</>
			);
		}
	});
};
