/**
 * Juxtapose Block
 * A block that allows inserting side-by-side image comparison.
 * Uses JuxtaposeJS from KnightLab.
 * https://github.com/NUKnightLab/juxtapose
 */


// WordPress dependencies
import { registerBlockType } from '@wordpress/blocks';
import { RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import edit from './edit';

export function registerBlock() {

	registerBlockType( 'mkaz/juxtapose-block', {

		title: 'Juxtapose Images',

		icon: 'image-flip-horizontal',

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
				imageBefore: 'https://placedog.net/240/120',
				imageAfter: 'https://placedog.net/239/119',
				caption: 'Doggos',
			},
		},

		edit,

		save: ({ attributes }) => {
			return (
				<>
					<figure className='juxtapose' data-mode={attributes.orientation}>
						<img src={attributes.imageBefore} className='imgBefore'/>
						<img src={attributes.imageAfter} className= 'imgAfter'/>
					</figure>
					{ ! RichText.isEmpty( attributes.caption ) && (
						<RichText.Content tagName="figcaption" value={ attributes.caption } />
					) }
				</>
			);
		}
	});
};
