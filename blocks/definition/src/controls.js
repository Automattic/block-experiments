/**
 * External dependencies
 */
/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	Button,
	Panel,
	PanelBody,
	SelectControl,
	ToggleControl,
	PanelRow,
	ExternalLink,
} from '@wordpress/components';
import { __unstableStripHTML as stripHTML } from '@wordpress/dom';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SearchResults from './components/search-results';
import useFetchDefinition from './use-fetch-definition';
import { isEmpty } from 'lodash';
import { DictionaryApi } from './lib/dictionary-apis';
import { getLocaleFromLocaleData } from './utils';

/**
 * Returns help text for the abbreviation toggle control
 *
 * @param {boolean} checked Whether the control is checked or not.
 * @return {string}         The help message.
 */
function getToggleAbbreviationHelp( checked ) {
	return checked
		? __(
				'Your definition is an abbreviation, e.g., LOL, and is wrapped in an <abbr /> tag',
				'definition'
		  )
		: __(
				'Your definition is a whole word or term and not an abbreviation.',
				'definition'
		  );
}

/**
 * Returns help text for the should show meta toggle control.
 *
 * @param {boolean} checked Whether the control is checked or not.
 * @return {string}         The help message.
 */
function getToggleShouldShowTermMetaHelp( checked ) {
	return checked
		? __( 'Show parts of speech and other term information.', 'definition' )
		: __( 'Hide parts of speech and other term information', 'definition' );
}

/**
 * Stores and returns a dictionary API object.
 *
 * @param {string} key A key identifier for a Dictionary API.
 * @return {Function}  A dictionary class with static member methods.
 */
function getDictionaryApiByKey( key = 'dictionaryApi' ) {
	return {
		dictionaryApi: DictionaryApi,
	}[ key ];
}

/**
 * Returns editor controls.
 *
 * @param root0
 * @param root0.term
 * @param root0.isAbbreviation
 * @param root0.onToggleAbbreviation
 * @param root0.partOfSpeech
 * @param root0.onChangePartOfSpeech
 * @param root0.partsOfSpeechOptions
 * @param root0.onSelectDefinition
 * @param root0.shouldShowTermMeta
 * @param root0.onToggleShouldShowTermMeta
 * @return {WPElement} Element to render.
 */
export default function DefinitionControls( {
	term,
	isAbbreviation,
	onToggleAbbreviation,
	partOfSpeech,
	onChangePartOfSpeech,
	partsOfSpeechOptions,
	onSelectDefinition,
	shouldShowTermMeta,
	onToggleShouldShowTermMeta,
} ) {
	const [ shouldShowLanguagePicker, setShouldShowLanguagePicker ] = useState(
		false
	);
	const [ searchLocale, setSearchLocale ] = useState(
		getLocaleFromLocaleData()
	);
	const [ shouldShowSearchResults, setShouldShowSearchResults ] = useState(
		false
	);
	const [ definitionOptions, setDefinitionOptions ] = useState( [] );
	// We cache the last search term so we compare with incoming `term` prop.
	const [ searchTerm, setSearchTerm ] = useState( '' );
	const [ selectedSearchTermId, setSelectedSearchTermId ] = useState( null );

	const dictionaryApi = getDictionaryApiByKey();
	const {
		isFetching,
		definitionData,
		fetchDefinition,
		errorMessage,
	} = useFetchDefinition( {
		locale: searchLocale,
		api: dictionaryApi,
	} );
	const searchForDefinition = () => {
		if ( ! term || isFetching ) {
			return;
		}

		const strippedTerm = stripHTML( term );

		// Don't perform fetch if the current term already matches the fetched term.
		if ( strippedTerm === definitionData?.definition ) {
			setShouldShowSearchResults( true );
			return;
		}

		setSearchTerm( strippedTerm );
		fetchDefinition( strippedTerm );
	};

	const setDefinitionData = ( indexKey ) => {
		setSelectedSearchTermId( indexKey );
		const {
			definition,
			partOfSpeech,
			phoneticTranscription,
			isAbbreviation,
		} = dictionaryApi.getSelectedDefinition(
			definitionData,
			indexKey.split( '-' )
		);
		onSelectDefinition( {
			definition,
			partOfSpeech,
			phoneticTranscription,
			isAbbreviation,
		} );
	};

	const showLocalePicker = () => setShouldShowLanguagePicker( true );
	const hideLocalePicker = () => setShouldShowLanguagePicker( false );

	// Close the search results if the definition term changes.
	useEffect( () => {
		if ( term !== searchTerm || errorMessage ) {
			setShouldShowSearchResults( false );
		}
	}, [ term, searchTerm, errorMessage ] );

	// Set new UI definition data when definitionData from fetch updates.
	useEffect( () => {
		if ( ! isEmpty( definitionData ) ) {
			const newDefinitionOptions = DictionaryApi.getOptionsList(
				definitionData
			);

			setDefinitionOptions( newDefinitionOptions );

			if ( newDefinitionOptions.length > 0 ) {
				setShouldShowSearchResults( true );
			}
		}
	}, [ definitionData ] );

	return (
		<Panel>
			<PanelBody title={ __( 'Definition settings', 'definition' ) }>
				<PanelRow className="wp-block-a8c-definition__panel-row wp-block-a8c-definition__panel-row--definition-settings">
					<SelectControl
						label={ __(
							'Part of speech (optional)',
							'definition'
						) }
						value={ partOfSpeech }
						options={ partsOfSpeechOptions }
						onChange={ onChangePartOfSpeech }
						hideCancelButton={ false }
					/>
					<span className="wp-block-a8c-definition__definition-settings-help-text">
						Not sure? See{ ' ' }
						<ExternalLink href="https://en.wikipedia.org/wiki/Part_of_speech">
							Parts of Speech
						</ExternalLink>
					</span>
				</PanelRow>
				<PanelRow className="wp-block-a8c-definition__panel-row">
					<ToggleControl
						label={ __(
							'Is the term an abbreviation?',
							'definition'
						) }
						checked={ isAbbreviation }
						onChange={ onToggleAbbreviation }
						help={ getToggleAbbreviationHelp }
					/>
				</PanelRow>
				<PanelRow className="wp-block-a8c-definition__panel-row">
					<ToggleControl
						label={ __( 'Show term meta.', 'definition' ) }
						checked={ shouldShowTermMeta }
						onChange={ onToggleShouldShowTermMeta }
						help={ getToggleShouldShowTermMetaHelp }
					/>
				</PanelRow>
			</PanelBody>

			<PanelBody title={ __( 'Search definition online', 'definition' ) }>
				{ ! term && (
					<PanelRow>
						{ ' ' }
						{ __(
							'Enter a definition term in the Editor block to search.',
							'definition'
						) }
					</PanelRow>
				) }
				{ term && (
					<PanelRow className="wp-block-a8c-definition__panel-row wp-block-a8c-definition__search-control-container">
						{ term && ! shouldShowSearchResults && (
							<Button
								className="wp-block-a8c-definition__search-button"
								isLink
								icon="search"
								isBusy={ isFetching }
								disabled={ isFetching }
								onClick={ searchForDefinition }
							>
								{ sprintf(
									/* translators: placeholder is a work or term the user wishes to search. */
									__(
										'Search definition for "%s"',
										'definition'
									),
									stripHTML( term )
								) }
							</Button>
						) }
						{ errorMessage && (
							<PanelRow className="wp-block-a8c-definition__error-message">
								{ errorMessage }
							</PanelRow>
						) }
						{ shouldShowSearchResults && (
							<SearchResults
								title={ sprintf(
									/* translators: placeholder is a work or term the user wishes to search. */
									__(
										'Search results for "%s"',
										'definition'
									),
									stripHTML( term )
								) }
								searchResults={ definitionOptions }
								onSelectDefinition={ setDefinitionData }
								selectedId={ selectedSearchTermId }
							/>
						) }
					</PanelRow>
				) }
{/*				<PanelRow className="wp-block-a8c-definition__current-locale">
					{ __( 'Current search locale:' ) }
					<Button
						className="wp-block-a8c-definition__current-locale-button"
						isSmall
						variant="secondary"
						onClick={ showLocalePicker }
					>
						{ searchLocale }
					</Button>
					{ shouldShowLanguagePicker && (
						<div className="wp-block-a8c-definition__locale-picker">
							{ dictionaryApi
								.getSupportedLocales()
								.map( ( locale ) => (
									<Button
										className="wp-block-a8c-definition__locale"
										isSmall
										variant="secondary"
										onClick={ () => hideLocalePicker() }
										key={ locale }
									>
										{ locale }
									</Button>
								) ) }
						</div>
					) }
				</PanelRow>*/}
			</PanelBody>
		</Panel>
	);
}
