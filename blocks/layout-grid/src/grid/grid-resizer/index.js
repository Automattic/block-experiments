/**
 * External dependencies
 */

import classnames from 'classnames';

/**
 * WordPress dependencies
 */

import { useState, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */

import ResizeHandle from './resize-handle';
import Resizer from './resizer';
import { getAdjustedOffset, getMouseX, getAdjustedTop } from './resize-position';

/** @typedef {import('../../constants.js').Column} Column */

/**
 * Resize data
 *
 * @typedef ResizeData
 * @type
 * @property {number} resizingColumn - The column being resized
 * @property {('left'|'right')} direction - `left` if the left handle is resizing, `right` if the right
 * @property {number} xPos - X position of the drag handle
 * @property {number} height - Height of the drag handle
 * @property {number} width - Wdith of the drag handle
 * @property {number} top - Top offset of the drag handle
 * @property {number} max - Maximum xPos
 */

/**
 * @callback OnResize - Called when the grid is resized.
 * @param {number} columnNumber - The column that has changed
 * @param {Column} adjustments - Adjustments
 */

/**
 * Get's the column number by looking at the position of the element within the DOM
 *
 * @param {Node} element - Element to look at
 * @returns {number}
 */
function getColumnNumber( element ) {
	let pos = 0;

	while ( element.previousSibling !== null ) {
		element = element.previousSibling;
		pos++;
	}

	return pos;
}

/**
 * Get all the details from the initial mouse/touch event:
 * - column being changed
 * - which direction
 * - start position
 * - height and width of the column
 *
 * @param {object} ev - The event that triggered the resize
 * @param {object} containerRef - Reference to the resize container
 * @returns {ResizeData}
 */
function getStartOfResize( ev, containerRef ) {
	const { target } = ev;
	const block = target.closest( '.wp-block' );
	const { height, right, left, top } = block.getBoundingClientRect();
	const { width } = target.getBoundingClientRect();
	const isLeft = target.dataset.resizeLeft;

	return {
		resizingColumn: getColumnNumber( block ),
		direction: isLeft ? 'left' : 'right',
		xPos: getAdjustedOffset( containerRef, getMouseX( ev ), width ),
		height,
		width,
		top: getAdjustedTop( top, containerRef ),
		max: isLeft ? getAdjustedOffset( containerRef, right, width ) : getAdjustedOffset( containerRef, left, width ),
	};
}

/**
 * The ResizeGrid is responsible for providing resizable grid column handles. It maps absolute mouse positions to grid columns.
 *
 * Due to the way the Gutenberg DOM is laid out, the ResizeGrid doesn't provide the resize handles that surround a column. Instead it
 * listens for mousedown events and when one happens it then displays a 'fake' resize handle that can be dragged. As the fake handle is
 * moved, the underlying grid is updated, giving the appearance it is being directly updated.
 *
 * @param {object} props - Component props
 * @param {string} props.className - Class name
 * @param {boolean} props.isSelected - Is the block selected?
 * @param {number} props.totalColumns - Number of columns for the selected device
 * @param {Column[]} props.columns - All columns for the selected device
 * @param {object} props.children - Child components
 * @param {OnResize} props.onResize - Resize callback when a change to columns is made
 */
function ResizeGrid( props ) {
	const { className, children, isSelected, onResize, totalColumns, columns } = props;
	const [ resizing, setResizing ] = useState( null );
	const containerRef = useRef();
	const classes = classnames( className, { 'wp-block-jetpack-layout-grid__resizing': resizing !== null } );

	function startResize( ev ) {
		const { target } = ev;

		if ( ( ev.button === 0 || ev.touches ) && ( target.dataset.resizeRight || target.dataset.resizeLeft ) ) {
			setResizing( getStartOfResize( ev, containerRef ) );

			if ( ev.button === 0 ) {
				ev.preventDefault();
			}

			ev.stopPropagation();
		}
	}

	return (
		<div className={ classes } onMouseDown={ startResize } onTouchStart={ startResize } ref={ containerRef }>
			{ resizing && (
				<Resizer
					resize={ resizing }
					onResize={ onResize }
					onStopResizing={ () => setResizing( null ) }
					totalColumns={ totalColumns }
					columns={ columns }
					container={ containerRef }
					renderHandle={ ( resize ) => (
						<ResizeHandle
							direction={ resize.direction }
							height={ resize.height }
							xPos={ resize.xPos }
							top={ resize.top }
							isSelected={ isSelected }
						/>
					) }
				/>
			) }

			{ children }
		</div>
	);
}

export default ResizeGrid;
