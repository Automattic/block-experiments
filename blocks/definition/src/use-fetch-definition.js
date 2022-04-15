/**
 * External dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { DEFAULT_LOCALE } from './constants';

/**
 * A hook to fetch a dictionary definition from an API.
 *
 * @param {string} initialSearchTermValue The initial value of the search term.
 * @param {string} locale 				  The target language of the definition.
 * @return {object}                       A object of methods and properties to access API request data.
 */
const useFetchDefinition = ( {
	initialSearchTermValue = '',
	locale = DEFAULT_LOCALE,
	api,
} ) => {
	const [ isFetching, setIsFetching ] = useState( false );
	const [ term, setTerm ] = useState( initialSearchTermValue );
	const [ definitionData, setDefinitionData ] = useState( {} );
	const [ errorMessage, setErrorMessage ] = useState( '' );
	const defaultErrorMessage = __(
		"Sorry, we couldn't find a definition.",
		'definition'
	);

	useEffect( () => {
		if ( ! term ) {
			return;
		}

		setErrorMessage( '' );

		// TODO: support other locales. Medium priority.
		// TODO: support other dictionary sources. Low priority.
		const fetchUrl = api.getFetchUrl( term, locale );

		const fetchResults = async () => {
			setIsFetching( true );

			const definitionFetch = await window.fetch( fetchUrl )
				.then( ( response ) => {
					if ( response.ok ) {
						return response;
					}
					setErrorMessage( defaultErrorMessage );
					return false;
				} )
				.catch( () => {
					setErrorMessage( defaultErrorMessage );
					return false;
				} );

			if ( definitionFetch ) {
				const definitionResponse = await definitionFetch.json();
				setDefinitionData( {
					term,
					...definitionResponse
				} );
			}
			setIsFetching( false );
		};

		fetchResults();
	}, [ term ] );

	return { isFetching, definitionData, errorMessage, fetchDefinition: setTerm };
};

export default useFetchDefinition;
