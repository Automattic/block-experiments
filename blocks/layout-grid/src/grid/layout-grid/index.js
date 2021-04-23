/**
 * Internal dependencies
 */

import {
	getSpanForDevice,
	getOffsetForDevice,
} from '../../constants';
import {
	getGridWidth,
	getGridMax,
	getDefaultSpan,
} from '../grid-defaults';

/**
 * This contains all the grid column layout logic. That is, it knows how to move and resize columns on a grid (including a grid with multiple rows).
 * It does not handle mapping resize handles to grid positions
 */
class LayoutGrid {
	constructor( attributes, device, columns ) {
		this.attributes = attributes;
		this.device = device;
		this.columnCount = columns;
	}

	// Gets a copy of the grid so we can modify it
	getGridValues() {
		const grid = {};

		for ( let pos = 0; pos < this.columnCount; pos++ ) {
			const defaultSpan = getDefaultSpan( this.device, this.columnCount, pos );

			grid[ getSpanForDevice( pos, this.device ) ] = this.getSpan( pos ) || defaultSpan;
			grid[ getOffsetForDevice( pos, this.device ) ] = this.getOffset( pos );
		}

		return grid;
	}

	/*
	 * Apply a set of adjustments and return a new copy of the grid
	 */
	applyAdjustments( adjustments ) {
		let grid = this.getGridValues();

		// Run through the adjustments and apply to the grid
		for ( let index = 0; index < adjustments.length; index++ ) {
			grid = { ...grid, ...adjustments[ index ] };
		}

		return grid;
	}

	getSpanAdjustment( column, value ) {
		return { [ getSpanForDevice( column, this.device ) ]: value }
	}

	getAdjustOffset( column, value ) {
		return { [ getOffsetForDevice( column, this.device ) ]: value }
	}

	getShrinkOffset( column, remaining ) {
		const spareOffset = this.getOffset( column );
		const offsetUsed = remaining >= spareOffset ? spareOffset : remaining;

		return {
			adjustment: this.getAdjustOffset( column, spareOffset - offsetUsed ),
			offsetUsed,
		};
	}

	hasOverlaps( positions ) {
		for ( let index = 0; index < positions.length; index++ ) {
			const first = positions[ index ];

			for ( let inner = index + 1; inner < positions.length; inner++ ) {
				const second = positions[ inner ];

				if ( first.start > second.start && first.start < second.end ) {
					return true;
				}

				if ( first.end > second.start && first.end < second.end ) {
					return true;
				}
			}
		}

		return false;
	}

	/*
	 * Determine if an adjusted grid is valid. That is, the total of all the spans and offsets does not exceed
	 * the maximum allowed by the grid layout, and none of the columns overlap each other
	 */
	validateGrid( grid ) {
		const positions = [];
		const rowWidth = getGridWidth( this.device );
		let total = 0, rowTotal = 0;

		for ( let pos = 0; pos < this.columnCount; pos++ ) {
			const span = grid[ getSpanForDevice( pos, this.device ) ];
			const offset = grid[ getOffsetForDevice( pos, this.device ) ];

			rowTotal += offset;
			if ( rowTotal >= rowWidth ) {
				rowTotal = rowTotal - rowWidth;
			}

			rowTotal += span;

			// Does this row exceed the limit?
			if ( rowTotal > rowWidth ) {
				return false;
			}

			positions.push( { start: total + offset, end: total + offset + span } );

			total += span + offset;
		}

		// Does it fit within the grid?
		if ( total > getGridMax( this.device, this.columnCount ) ) {
			return false;
		}

		// Do we have any overlaps?
		if ( this.hasOverlaps( positions ) ) {
			return false;
		}

		return true;
	}

	/*
	 * The end of a column was adjusted. Absorb/increase any offsets in subsequent columns so they remain in place
	 * Returns an array of column adjustments
	 */
	getEndAdjustments( column, diff ) {
		const changes = [];

		if ( diff < 0 ) {
			// Column end has moved left - add extra offset to the next column to keep it in place
			const adjustment = this.getAdjustOffset( column, this.getOffset( column ) + Math.abs( diff ) );

			return [ adjustment ];
		}

		if ( diff > 0 ) {
			// Column end has moved right - eat any offset space after the column
			for ( let index = column; index < this.columnCount && diff > 0; index++ ) {
				const adjust = this.getShrinkOffset( index, Math.abs( diff ) );

				changes.push( adjust.adjustment );
				diff -= adjust.offsetUsed;
			}
		}

		return changes;
	}

	getStartMovedLeft( column, diff ) {
		const changes = [];

		// Column start has moved left - eat any offset space before the column, including the column's own offset
		for ( let index = column; index >= 0 && diff > 0; index-- ) {
			const adjust = this.getShrinkOffset( index, diff );

			changes.push( adjust.adjustment );
			diff -= adjust.offsetUsed;
		}

		return changes;
	}

	/*
	 * The start of a column was adjusted. Make adjustments to other columns so everything remains in place
	 * Returns an array of column adjustments
	 */
	getStartAdjustments( column, newStart ) {
		const currentOffset = this.getOffset( column );
		const newOffset = this.getOffsetFromStart( column, newStart );
		const diff = newOffset - currentOffset;

		if ( diff < 0 ) {
			return this.getStartMovedLeft( column, Math.abs( diff ) );
		}

		return [ this.getAdjustOffset( column, newOffset ) ];
	}

	/*
	 * Get span for a column
	 */
	getSpan( column ) {
		return this.attributes[ getSpanForDevice( column, this.device ) ]
	}

	/*
	 * Get offset from previous column
	 */
	getOffset( column ) {
		return this.attributes[ getOffsetForDevice( column, this.device ) ]
	}

	/*
	 * Get absolute start value for a column from the start of the row
	 */
	getStart( column ) {
		let start = 0;

		// Add all the offset and spans of previous columns
		for ( let pos = 0; pos < column; pos++ ) {
			start += this.getSpan( pos ) + this.getOffset( pos );
		}

		const rows = Math.max( 1, ( Math.floor( start / getGridWidth( this.device ) ) ) );

		// Finally add the offset of our column to take us to the start of it, and then make it relative to the start of the row
		return ( start + this.getOffset( column ) ) % ( rows * getGridWidth( this.device ) );
	}

	/*
	 * Opposite of getStart() - returns an offset from the previous column when given a new start position
	 */
	getOffsetFromStart( column, start ) {
		if ( column === 0 ) {
			// Simple - the first column offset is the start position
			return start;
		}

		const currentStart = this.getStart( column ); // This is the current start
		const diff = start - currentStart;

		return this.getOffset( column ) + diff;
	}

	convertOffsetToStart( column, offset ) {
		const start = this.getStart( column );
		const diff = offset - this.getOffset( column );

		return start + diff;
	}

	/*
	 * Returns the layout grid, with an adjustment made. If no adjustment is made then returns null
	 */
	getAdjustedGrid( column, adjustment ) {
		const {
			start = this.getStart( column ),
			span = this.getSpan( column ),
		} = adjustment;

		// Get an array of adjustments so we can then check the grid is still valid before committing
		let adjustments = [];

		if ( start !== this.getStart( column ) && span !== this.getSpan( column ) ) {
			// Both start and span have changed
			adjustments = adjustments.concat( this.getStartAdjustments( column, start ) );
			adjustments = adjustments.concat( this.getSpanAdjustment( column, span ) );
		} else if ( span !== this.getSpan( column ) ) {
			// Only span has changed. Adjust that, and any columns that come after this
			adjustments = adjustments.concat( this.getSpanAdjustment( column, span ) );
			adjustments = adjustments.concat( this.getEndAdjustments( column + 1, span - this.getSpan( column ) ) );
		} else if ( start !== this.getStart( column ) ) {
			// Only the start has changed. Adjust that, and ensure subsequent columns dont move
			adjustments = adjustments.concat( this.getStartAdjustments( column, start ) );
			adjustments = adjustments.concat( this.getEndAdjustments( column + 1, start - this.getStart( column ) ) );
		}

		// Convert the array of adjustments to a new set of attributes
		const adjustedGrid = this.applyAdjustments( adjustments );

		// Now check everything still fits. If it doesnt then we ignore the entire change
		if ( adjustments.length > 0 && this.validateGrid( adjustedGrid ) ) {
			// Update all the values at once
			return adjustedGrid;
		}

		return null;
	}
}

export default LayoutGrid;
