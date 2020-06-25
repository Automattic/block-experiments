/**
 * Internal dependencies
 */

/** @typedef {import('../../constants.js').Column} Column */
/** @typedef {import('../../constants.js').ColumnAdjustment} ColumnAdjustment */

/**
 * Adjustment of span, start, or offset for a column. Not all values need be present. If both `start` and `offset` are present then `start` is used.
 *
 * @typedef GridAdjustment
 * @type
 * @property {number} [span]
 * @property {number} [offset]
 * @property {number} [start]
 */

/**
 * Shrink the span of a column
 *
 * @param {Column} column
 * @param {number} columnNumber
 * @param {number} diff
 * @returns {ColumnAdjustment}
 */
function shrinkColumn( column, columnNumber, diff ) {
	return {
		column: columnNumber,
		start: column.start,
		span: column.span - diff,
	};
}

/**
 * Shrink a column while moving it by the same amount
 *
 * @param {Column} column
 * @param {number} columnNumber
 * @param {number} diff
 * @returns {ColumnAdjustment}
 */
function shrinkAndPushColumn( column, columnNumber, diff ) {
	return {
		column: columnNumber,
		start: column.start + diff,
		span: column.span - diff,
	};
}

/**
 * Get the adjusted start value, either by using an offset (from the block inspector) or a start (from resizing). Return the current start if neither adjustment is present
 *
 * @param {GridAdjustment} adjustment - The change in span and start/offset
 * @param {Column[]} grid - Grid columns
 * @param {number} columnNumber - The column being adjusted
 * @param {number} currentStart - Current start
 */
function getAdjustedStart( adjustment, grid, columnNumber, currentStart ) {
	if ( typeof adjustment.offset !== 'undefined' ) {
		const lastColumn = columnNumber > 0 ? grid[ columnNumber - 1 ] : null;

		return lastColumn ? lastColumn.start + lastColumn.span + adjustment.offset : adjustment.offset;
	}

	if ( typeof adjustment.start !== 'undefined' ) {
		return adjustment.start;
	}

	return currentStart;
}

/**
 * Returns a set of grid adjustments that result from a single column being adjusted. Multiple columns may be affected. Includes original adjustment
 *
 * @param {Column[]} grid - Grid columns
 * @param {GridAdjustment} adjustment - The change in span and start/offset
 * @param {number} columnNumber - The column being adjusted
 * @returns {ColumnAdjustment[]}
 */
export default function getGridAdjustments( grid, adjustment, columnNumber ) {
	const { span: currentSpan, start: currentStart, row } = grid[ columnNumber ];
	const adjustedSpan = adjustment.span || currentSpan;
	const adjustedStart = getAdjustedStart( adjustment, grid, columnNumber, currentStart );
	const changes = [ { column: columnNumber, start: adjustedStart, span: adjustedSpan } ];

	// Has anything changed? Return no adjustments if not
	if ( adjustedSpan === currentSpan && adjustedStart === currentStart ) {
		return [];
	}

	// Start position has moved left - we may need to adjust the span of the previous column (if it's on the same row)
	if ( adjustedStart < currentStart && columnNumber > 0 ) {
		const previousEnd = grid[ columnNumber - 1 ].start + grid[ columnNumber - 1 ].span;

		// Overlapping the previous column on the same row? Squash it down
		if ( adjustedStart < previousEnd && grid[ columnNumber - 1 ].row === row ) {
			changes.push( shrinkColumn( grid[ columnNumber - 1 ], columnNumber - 1, currentStart - adjustedStart ) );
		}
	}

	// Span has increased - we need to adjust the start and span of the next column (if it's on the same row)
	if ( adjustedSpan > currentSpan && columnNumber < grid.length - 1 ) {
		const newEnd = adjustedStart + adjustedSpan;
		const diff = grid[ columnNumber + 1 ].start - newEnd;

		// Is this overlapping the next column? Shrink and move it up
		if ( diff < 0 && grid[ columnNumber + 1 ].row === row ) {
			changes.push( shrinkAndPushColumn( grid[ columnNumber + 1 ], columnNumber + 1, Math.abs( diff ) ) );
		}
	}

	return changes;
}
