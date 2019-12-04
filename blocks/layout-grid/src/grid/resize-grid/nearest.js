/*
 * Returns the 0-based column that the mouse is closest to
 */
export default function findNearest( parent, xPos, direction, totalColumns ) {
	// Each column is 1/12th the width of the parent
	const { width, x } = parent.getBoundingClientRect();
	const colWidth = width / totalColumns;
	const mousePos = xPos - x;

	// Which column does mousePos fall into?
	const column = Math.floor( mousePos / colWidth );
	const offsetInColumn = mousePos % colWidth;

	// If we're going left then we need to be in the first half of a column
	if ( direction === 'left' ) {
		if ( offsetInColumn <= colWidth / 2 ) {
			// Matched this column
			return column;
		}

		// Not gone over the threshold - match the next column
		return column + 1;
	}

	// If going right we need to be in the second half
	if ( offsetInColumn < colWidth / 2 ) {
		// Matched this column
		return column;
	}

	return column + 1;
}
