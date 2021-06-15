/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { content } = attributes;

	return (
		<section { ...useBlockProps.save() }>
			<RichText.Content multiline value={ content } />
		</section>
	);
}
