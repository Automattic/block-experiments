/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import DefinitionControls from './controls';
import TermMetaData from './components/term-metadata';
import { PARTS_OF_SPEECH, ABBREVIATION } from './constants';

/**
 * Definition Edit method.
 *
 * @param props
 * @param props.attributes
 * @param props.setAttributes
 * @return {WPElement} Element to render.
 */
export default function DefinitionEdit( { attributes, setAttributes } ) {
	const {
		definition,
		term,
		isAbbreviation,
		partOfSpeech,
		phoneticTranscription,
		shouldShowTermMeta,
	} = attributes;
	const blockProps = useBlockProps( {
		className: 'wp-block-a8c-definition',
	} );
	const onToggleAbbreviation = ( newValue ) => {
		const newPartOfSpeech =
			newValue && partOfSpeech !== ABBREVIATION
				? ABBREVIATION
				: partOfSpeech;
		setAttributes( {
			isAbbreviation: newValue,
			partOfSpeech: newPartOfSpeech,
		} );
	};
	const onToggleShouldShowTermMeta = () =>
		setAttributes( { shouldShowTermMeta: ! shouldShowTermMeta } );
	const onChangePartOfSpeech = ( newValue ) => {
		const newIsAbbreviation =
			newValue === ABBREVIATION && ! isAbbreviation ? true : false;
		setAttributes( {
			partOfSpeech: newValue,
			isAbbreviation: newIsAbbreviation,
		} );
	};
	const setDefinitionData = ( {
		definition,
		partOfSpeech,
		phoneticTranscription,
		isAbbreviation,
	} ) => {
		setAttributes( {
			definition,
			partOfSpeech,
			phoneticTranscription,
			isAbbreviation,
		} );
	};
	const definitionTagName = isAbbreviation ? 'abbr' : 'dfn';

	// Reset term data if term is deleted.
	useEffect( () => {
		if ( ! term ) {
			setAttributes( {
				partOfSpeech: '',
				definition: '',
				isAbbreviation: false,
				phoneticTranscription: '',
			} );
		}
	}, [ term ] );

	return (
		<>
			<InspectorControls>
				<DefinitionControls
					term={ term }
					onToggleAbbreviation={ onToggleAbbreviation }
					isAbbreviation={ isAbbreviation }
					partOfSpeech={ partOfSpeech }
					onChangePartOfSpeech={ onChangePartOfSpeech }
					partsOfSpeechOptions={ PARTS_OF_SPEECH }
					onSelectDefinition={ setDefinitionData }
					shouldShowTermMeta={ shouldShowTermMeta }
					onToggleShouldShowTermMeta={ onToggleShouldShowTermMeta }
				/>
			</InspectorControls>
			<dl { ...blockProps }>
				<dt className="wp-block-a8c-definition__term">
					<RichText
						className="wp-block-a8c-definition__term-text"
						identifier="term"
						id="a8c-definition-term"
						tagName={ definitionTagName }
						aria-label={ __( 'Definition term', 'definition' ) }
						placeholder={ __(
							'Enter definition term',
							'definition'
						) }
						onChange={ ( newTerm ) =>
							setAttributes( { term: newTerm } )
						}
						value={ term }
						multiline={ false }
					/>
					{ shouldShowTermMeta && (
						<TermMetaData
							partOfSpeech={ partOfSpeech }
							phoneticTranscription={ phoneticTranscription }
						/>
					) }
				</dt>
				<RichText
					className="wp-block-a8c-definition__definition wp-block-a8c-definition__term-definition"
					role="definition"
					aria-labelledby="a8c-definition-term"
					identifier="definition"
					tagName="dd"
					aria-label={ __( 'Definition text', 'definition' ) }
					placeholder={ __( 'Enter definition text', 'definition' ) }
					onChange={ ( newDefinition ) =>
						setAttributes( { definition: newDefinition } )
					}
					value={ definition }
				/>
			</dl>
		</>
	);
}
