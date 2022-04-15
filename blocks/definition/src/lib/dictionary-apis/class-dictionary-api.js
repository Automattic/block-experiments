/**
 * A collection of static methods to fetch/interpret the results of the dictionaryapi API endpoint.
 * See: https://dictionaryapi.dev/
 * Each dictionary source class should have the same interface.
 */

export default class DictionaryApi {
	/**
	 * Returns a list of supported locale slugs. These are the slugs that the API accepts.
	 * Any transformations between WordPress and 3rd-party slugs should be done in `getFetchUrl`.
	 *
	 * @return {Array} A list of supported locale slugs.
	 */
	static getSupportedLocales() {
		return [
			'ar',
			'de',
			'en',
			'en_GB',
			'es',
			'fr',
			'hi',
			'it',
			'ja',
			'ko',
			'ru',
			'pt-BR',
			'tr',
		];
	}

	/**
	 * Returns an iterable collection of objects so we can display a select list etc.
	 *
	 * @param  {Object} definitionData The raw JSON results from a successful call to the API.
	 * @return {Array}                 A collection of options.
	 */
	static getOptionsList( definitionData ) {
		const newDefinitionOptions = [];
		for ( const definitionsIndex in definitionData ) {
			if (
				definitionData.hasOwnProperty( definitionsIndex ) &&
				Array.isArray( definitionData[ definitionsIndex ].meanings )
			) {
				definitionData[ definitionsIndex ].meanings.forEach(
					( meaning, meaningsIndex ) => {
						meaning.definitions.forEach(
							( subDefinition, subDefinitionIndex ) => {
								newDefinitionOptions.push( {
									value: `${ definitionsIndex }-${ meaningsIndex }-${ subDefinitionIndex }`,
									label: `${ subDefinition.definition } [${ meaning.partOfSpeech }]`,
								} );
							}
						);
					}
				);
			}
		}
		return newDefinitionOptions;
	}

	/**
	 * For the given indices, fetches the result from the API search results data.
	 *
	 * @param  {Object} definitionData The raw JSON results from a successful call to the API.
	 * @param  {Array}  indexArray     An array of indices pointing to a child property of the data. The order must correspond to the depth of the target value.
	 * @return {Object}                The properties of the definition. The properties correspond to the expected block attributes.
	 */
	static getSelectedDefinition( definitionData, indexArray = [] ) {
		const definition =
			definitionData[ indexArray[ 0 ] ].meanings[ indexArray[ 1 ] ]
				.definitions[ indexArray[ 2 ] ].definition;
		const partOfSpeech =
			definitionData[ indexArray[ 0 ] ].meanings[ indexArray[ 1 ] ]
				.partOfSpeech;
		let isAbbreviation = false;
		if ( partOfSpeech === 'abbreviation' ) {
			isAbbreviation = true;
		}
		const phoneticTranscription =
			definitionData[ indexArray[ 0 ] ].phonetics[ indexArray[ 1 ] ]
				?.text ||
			definitionData[ indexArray[ 0 ] ].phonetics[ 0 ]?.text;
		// TODO: add pronunciation audio. Low prio.
		//const newPhoneticAudio = definitionData[ indexArray[0] ].phonetics[ indexArray[1] ]?.audio || definitionData[ indexArray[0]  ].phonetics[0]?.audio;
		return {
			definition,
			partOfSpeech,
			phoneticTranscription,
			isAbbreviation,
		};
	}

	/**
	 * Takes a WordPress language code and returns the API's corresponding code.
	 * Not a required on the public interface.
	 *
	 * @param slug
	 * @return {string} The locale code.
	 */
	static _getApiSlug( slug ) {
		const supportedLocales = DictionaryApi.getSupportedLocales();

		// Check if there's a direct match.
		if ( supportedLocales.indexOf( slug ) > -1 ) {
			return slug;
		}

		// Return any custom transforms.
		const wpToApiSlugDictionary = {
			pt_BR: 'pt-BR',
		};

		if ( wpToApiSlugDictionary[ slug ] ) {
			return wpToApiSlugDictionary[ slug ];
		}

		// Finally check if there's match on the root of any language variants.
		if ( slug[ 2 ] === '_' ) {
			slug = slug.split( '_' )[ 0 ];
		}

		if ( supportedLocales.indexOf( slug ) > -1 ) {
			return slug;
		}

		return slug;
	}

	/**
	 * Returns a concatenated URL to fetch a definition for a given term and language.
	 *
	 * @param  {string} term The search term.
	 * @param  {string} lang The locale.
	 * @return {string}      The URL.
	 */
	static getFetchUrl( term, lang = 'en' ) {
		const apiLocale = DictionaryApi._getApiSlug( lang );
		return `https://api.dictionaryapi.dev/api/v2/entries/${ apiLocale }/${ term }`;
	}
}
