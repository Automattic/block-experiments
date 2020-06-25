/**
 * External dependencies
 */

import { times } from 'lodash';

/**
 * WordPress dependencies
 */

import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getGridWidth } from '../../grid-values';

/** @typedef {import('../../constants.js').Device} Device */
/** @typedef {import('../../constants.js').Column} Column */
/** @typedef {import('../../constants.js').GetColumn} GetColumn */
/** @typedef {import('../../constants.js').ChangeColumnCallback} ChangeColumnCallback */

function convertStartToOffset( device, columnCount, getColumn ) {
	const offsets = [];
	let position = 0;
	let lastRow = 0;

	for ( let index = 0; index < columnCount; index++ ) {
		const { start, span, row } = getColumn( device, index );

		if ( lastRow !== row ) {
			position = 0;
		}

		offsets.push( start - position );
		position = start + span;
	}

	return offsets;
}

/**
 * Inspector settings for a column in the Layout Grid
 *
 * @param {object} props - Component props
 * @param {number} props.columnCount - Current number of columns
 * @param {Device} props.device - Current device
 * @param {GetColumn} props.getColumn - Get details for a column
 * @param {ChangeColumnCallback} props.onChangeColumn - Callback to change the offset of a column
 */
function ColumnInspectorSettings( props ) {
	const { columnCount, device, getColumn, onChangeColumn } = props;
	const offsets = convertStartToOffset( device, columnCount, getColumn );

	return (
		<>
			{ times( columnCount, ( column ) => (
				<div className="jetpack-layout-grid-settings" key={ column }>
					<strong>
						{ __( 'Column', 'layout-grid' ) } { column + 1 }
					</strong>

					<div className="jetpack-layout-grid-settings__group">
						<TextControl
							type="number"
							label={ __( 'Offset', 'layout-grid' ) }
							value={ offsets[ column ] }
							min={ 0 }
							max={ getGridWidth( device ) - 1 }
							onChange={ ( value ) =>
								onChangeColumn( device, column, {
									offset: parseInt( value, 10 ),
								} )
							}
						/>

						<TextControl
							type="number"
							label={ __( 'Span', 'layout-grid' ) }
							value={ getColumn( device, column ).span }
							min={ 1 }
							max={ getGridWidth( device ) }
							onChange={ ( value ) =>
								onChangeColumn( device, column, {
									span: parseInt( value, 10 ),
								} )
							}
						/>
					</div>
				</div>
			) ) }
		</>
	);
}

export default ColumnInspectorSettings;
