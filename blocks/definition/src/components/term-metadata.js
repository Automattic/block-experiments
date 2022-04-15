/**
 * External dependencies.
 */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { findInCollection } from '../utils';
import { PARTS_OF_SPEECH } from '../constants';

/**
 * Term metadata to render in both the editor and the save methods.
 *
 * @param {Object} Props.
 * @param {string} Props.partOfSpeech
 * @param {string} Props.phoneticTranscription
 * @return {WPElement} Element to render.
 */
export function TermMetaData( { partOfSpeech, phoneticTranscription } ) {
	const shouldShowTermMetaData = !! partOfSpeech || !! phoneticTranscription;

	if ( ! shouldShowTermMetaData ) {
		return null;
	}
	// Find a translated part of speech value from our list or use the raw value.
	const partOfSpeechTitle =
		findInCollection( PARTS_OF_SPEECH, 'value', partOfSpeech )?.title ||
		partOfSpeech;

	return (
		<span className="wp-block-a8c-definition__definition wp-block-a8c-definition__term-metadata">
			{ partOfSpeech && (
				<span
					aria-label={ __(
						'The part of speech indicates how the word functions in meaning as well as grammatically within the sentence.',
						'definition'
					) }
					className="wp-block-a8c-definition__term-metadata-item"
				>
					{ partOfSpeechTitle }
				</span>
			) }
			{ phoneticTranscription && (
				<span className="wp-block-a8c-definition__term-metadata-item">
					{ phoneticTranscription }
				</span>
			) }
		</span>
	);
}

export default TermMetaData;
