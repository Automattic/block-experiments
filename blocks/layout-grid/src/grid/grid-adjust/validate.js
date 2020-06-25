/** @typedef {import('../../constants.js').Column} Column */
/** @typedef {import('../../constants.js').ColumnAdjustment} ColumnAdjustment */

/**
 * Get the column values, including any adjustments
 *
 * @param {Column} existing - Existing column data
 * @param {ColumnAdjustment|null} adjustmentsWithColumn - Adjustment for column, if any
 */
function getAdjustedColumn( existing, adjustmentsWithColumn ) {
	if ( adjustmentsWithColumn ) {
		return {
			start: typeof adjustmentsWithColumn.start !== 'undefined' ? adjustmentsWithColumn.start : existing.start,
			span: typeof adjustmentsWithColumn.span !== 'undefined' ? adjustmentsWithColumn.span : existing.span,
			row: existing.row,
		};
	}

	return existing;
}

const findColumn = ( adjustments, colNumber ) => adjustments.find( ( adjustment ) => adjustment.column === colNumber );

/**
 * Determine if an adjusted grid is valid:
 * - No columns overlaps
 * - Each column has a minimum span of 1
 * - Each column has a start and end that fits within the grid
 *
 * @param {Column[]} grid - Grid columns
 * @param {ColumnAdjustment[]} adjustments - Adjustments
 * @param {number} gridWidth - Width of the grid for the current device
 * @returns {boolean}
 **/
export default function validateGridAdjustments( grid, adjustments, gridWidth ) {
	for ( let pos = 0; pos < grid.length; pos++ ) {
		// Get column detail with any adjustments applied
		const { start, span, row } = getAdjustedColumn( grid[ pos ], findColumn( adjustments, pos ) );

		// Minimum size
		if ( span < 1 ) {
			return false;
		}

		// Start fits into the grid
		if ( start < 0 || start > gridWidth ) {
			return false;
		}

		// End fits into the grid
		if ( start + span > gridWidth ) {
			return false;
		}

		// Does it overlap with the end of last column and we're on the same row?
		if ( pos > 0 ) {
			const lastColumn = getAdjustedColumn( grid[ pos - 1 ], findColumn( adjustments, pos - 1 ) );

			if ( lastColumn.row === row && start < lastColumn.start + lastColumn.span ) {
				return false;
			}
		}
	}

	return true;
}
