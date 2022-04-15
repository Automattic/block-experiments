/**
 * External dependencies.
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';
import TermMetaData from './components/term-metadata';

/**
 * Save method. Renders the frontend markup.
 *
 * @param props
 * @param props.attributes
 * @return {WPElement} Element to render.
 */
export default function save( { attributes } ) {
	const {
		definition,
		term,
		isAbbreviation,
		partOfSpeech,
		phoneticTranscription,
		shouldShowTermMeta,
	} = attributes;
	const blockProps = useBlockProps.save( {
		className: 'wp-block-a8c-definition',
	} );
	const definitionTagName = isAbbreviation ? 'abbr' : 'dfn';

	return (
		<dl { ...blockProps }>
			<dt className="wp-block-a8c-definition__term">
				<RichText.Content
					className="wp-block-a8c-definition__term-text"
					id="a8c-definition-term"
					tagName={ definitionTagName }
					value={ term }
				/>
				{ shouldShowTermMeta && (
					<TermMetaData
						partOfSpeech={ partOfSpeech }
						phoneticTranscription={ phoneticTranscription }
					/>
				) }
			</dt>
			<RichText.Content
				className="wp-block-a8c-definition__definition wp-block-a8c-definition__term-definition"
				role="definition"
				aria-labelledby="a8c-definition-term"
				tagName="dd"
				value={ definition }
			/>
		</dl>
	);
}
