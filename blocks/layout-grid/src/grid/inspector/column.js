/**
 * External dependencies
 */

import classnames from 'classnames';

/**
 * WordPress dependencies
 */

import { ENTER, SPACE } from '@wordpress/keycodes';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColumnIcon from '../../icons';

/** @typedef {import('../../constants.js').ColumnDescription} ColumnDescription */
/** @typedef {import('./index.js').ChangeNumColumnsCallback} ChangeNumColumnsCallback */

/**
 * A column in the Layout Grid inspector
 *
 * @param {object} props - Component props
 * @param {number} props.columnCount - Total number of columns
 * @param {ColumnDescription} props.column - Current column
 * @param {ChangeNumColumnsCallback} props.changeNumberOfColumns - Change the number of columns
 */
function InsectorColumn( { column, columnCount, changeNumberOfColumns } ) {
	return (
		<div
			className={ classnames( 'block-editor-block-styles__item', {
				'is-active': columnCount === column.value,
			} ) }
			onClick={ () => changeNumberOfColumns( column.value ) }
			onKeyDown={ ( event ) => {
				if ( ENTER === event.keyCode || SPACE === event.keyCode ) {
					event.preventDefault();
					changeNumberOfColumns( column.value );
				}
			} }
			role="button"
			tabIndex={ 0 }
			aria-label={ column.label }
		>
			<div className="block-editor-block-styles__item-preview">
				<ColumnIcon columns={ column.value } />
			</div>
			<div className="editor-block-styles__item-label block-editor-block-styles__item-label">
				{ column.label }
			</div>
		</div>
	);
}

export default InsectorColumn;
