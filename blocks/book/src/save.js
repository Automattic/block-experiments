import { RichText } from '@wordpress/block-editor';
/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

import classnames from 'classnames';
import prefixClasses from './prefixClasses';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save( { className, attributes } ) {
	const {
		author,
		imageId,
		imageUrl,
		publicationDate,
		publisher,
		title,
		width,
	} = attributes;
	const hasMedia = !! imageId;

	const classes = classnames( 'wp-block-a8c-book', className );

	return (
		<div className={ classes }>
			{ hasMedia && (
				<div
					className={ prefixClasses( '__cover' ) }
					style={ { width } }
				>
					<img src={ imageUrl } alt={ imageId } />
				</div>
			) }
			<div className={ prefixClasses( '__meta' ) } style={ { width } }>
				{ title && (
					<RichText.Content
						tagName="p"
						className={ prefixClasses( '__title' ) }
						value={ title }
					/>
				) }
				{ author && (
					<RichText.Content
						tagName="p"
						className={ prefixClasses( '__author' ) }
						value={ author }
					/>
				) }
				{ publisher && (
					<RichText.Content
						tagName="p"
						className={ prefixClasses( '__publisher' ) }
						value={ publisher }
					/>
				) }
				{ publicationDate && (
					<RichText.Content
						tagName="p"
						className={ prefixClasses( '__publicationDate' ) }
						value={ publicationDate }
					/>
				) }
			</div>
		</div>
	);
}
