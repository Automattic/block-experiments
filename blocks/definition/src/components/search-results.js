/**
 * External dependencies.
 */
/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';

/**
 * Search results for dictionary search.
 *
 * @param {Object} Props.
 * @param {string} Props.selectedId
 * @param {Array} Props.searchResults
 * @param {Function} Props.onSelectDefinition
 * @param {string} Props.title
 * @return {WPElement} Element to render.
 */
export default function SearchResults( {
	selectedId = '',
	searchResults = [],
	onSelectDefinition,
	title,
} ) {
	return (
		<>
			<h4 className="wp-block-a8c-definition__search-results-title">
				{ title }
			</h4>
			<ol className="wp-block-a8c-definition__search-results">
				{ searchResults.length &&
					searchResults.map( ( option ) => (
						<li
							className={ `wp-block-a8c-definition__search-results-item ${
								selectedId === option.value ? 'is-selected' : ''
							}` }
							key={ option.value }
						>
							<Button
								className="wp-block-a8c-definition__search-results-item-button"
								isTertiary
								onClick={ () =>
									onSelectDefinition( option.value )
								}
							>
								{ option.label }
							</Button>
						</li>
					) ) }
			</ol>
		</>
	);
}
