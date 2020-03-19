/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';

const save = ( { attributes } ) => {
	const {
		imageBeforeId,
		imageBeforeUrl,
		imageBeforeAlt,
		imageAfterId,
		imageAfterUrl,
		imageAfterAlt,
		caption,
		orientation,
	} = attributes;

	return (
		<>
			<figure className="juxtapose" data-mode={ orientation }>
				<img id={ imageBeforeId } src={ imageBeforeUrl } alt={ imageBeforeAlt } className="image-compare__image-before" />
				<img id={ imageAfterId } src={ imageAfterUrl } alt={ imageAfterAlt } className="image-compare__image-after" />
			</figure>
			{ ! RichText.isEmpty( caption ) && (
				<RichText.Content tagName="figcaption" value={ caption } />
			) }
		</>
	);
};

export default save;

