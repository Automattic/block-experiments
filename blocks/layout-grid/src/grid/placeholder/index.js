/**
 * WordPress dependencies
 */

import { Button, Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */

import { getColumns } from '../../constants';
import ColumnIcon from '../../icons';

/** @typedef {import('../inspector/index.js').ChangeNumColumnsCallback} ChangeNumColumnsCallback */

/**
 * Layout grid placeholder
 *
 * @param {object} props - Component props
 * @param {string} props.className - Class for the placeholder
 * @param {ChangeNumColumnsCallback} props.changeNumberOfColumns - Change the number of columns
 */
function LayoutGridPlaceholder( props ) {
	const { className, changeNumberOfColumns } = props;

	return (
		<Placeholder
			icon="layout"
			label={ __( 'Choose Layout', 'layout-grid' ) }
			instructions={ __(
				'Select a layout to start with:',
				'layout-grid'
			) }
			className={ className }
		>
			<ul className="block-editor-inner-blocks__template-picker-options">
				{ getColumns().map( ( column ) => (
					<li key={ column.value }>
						<Button
							icon={ <ColumnIcon columns={ column.value } /> }
							onClick={ () => changeNumberOfColumns( column.value ) }
							className="block-editor-inner-blocks__template-picker-option"
							label={ column.label }
							isSecondary
						/>
					</li>
				) ) }
			</ul>
		</Placeholder>
	);
}

export default LayoutGridPlaceholder;
