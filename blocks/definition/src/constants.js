/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

export const ABBREVIATION = 'abbreviation';

export const DEFAULT_LOCALE = 'en';

export const PARTS_OF_SPEECH = [
	{
		label: __( 'Choose a word class (optional)', 'definition' ),
		value: '',
	},
	{
		label: __( 'Noun, e.g., Apple', 'definition' ),
		title: __( 'Noun', 'definition' ),
		value: 'noun',
	},
	{
		label: __( 'Verb, e.g., Eat', 'definition' ),
		title: __( 'Verb', 'definition' ),
		value: 'verb',
	},
	{
		label: __( 'Article, e.g., The', 'definition' ),
		title: __( 'Article', 'definition' ),
		value: 'article',
	},
	{
		label: __( 'Pronoun, e.g., Their', 'definition' ),
		title: __( 'Pronoun', 'definition' ),
		value: 'pronoun',
	},
	{
		label: __( 'Preposition, e.g., With', 'definition' ),
		title: __( 'Preposition', 'definition' ),
		value: 'preposition',
	},
	{
		label: __( 'Adverb, e.g., Quickly', 'definition' ),
		title: __( 'Adverb', 'definition' ),
		value: 'adverb',
	},
	{
		label: __( 'Conjunction, e.g., And', 'definition' ),
		title: __( 'Conjunction', 'definition' ),
		value: 'conjunction',
	},
	{
		label: __( 'Abbreviation, e.g., PLC', 'definition' ),
		title: __( 'Abbreviation', 'definition' ),
		value: ABBREVIATION,
	},
];
