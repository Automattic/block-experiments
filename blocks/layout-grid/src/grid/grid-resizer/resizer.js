/**
 * WordPress dependencies
 */

import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getStart } from '../grid-adjust';
import { getAdjustedOffset, getMouseX } from './resize-position';
import findNearest from './nearest';

/** @typedef {import('./index.js').OnResize} OnResize */
/** @typedef {import('./index.js').ResizeData} ResizeData */
/** @typedef {import('../../constants.js').Column} Column */

/**
 * Render a resize handle
 * @callback RenderHandler
 * @param {ResizeData} resize
 */

/**
 * @callback StopResizing
 */

/**
 * Get the adjustment applied to the current column to transform to the current mouse/touch position
 *
 * @param {ResizeData} resize - Resize data
 * @param {object} containerRef - Grid container
 * @param {('left'|'right')} direction - Direction the adjustment is going
 * @param {number} totalColumns - Number of columns
 * @param {Column[]} columns - All columns for the selected device
 * @param {MouseEventInit} mouse - Mouse event
 */
function getAdjustmentForMove( resize, containerRef, direction, totalColumns, columns, mouse ) {
	const { start, span } = columns[ resize.resizingColumn ];
	const nearest = Math.min(
		totalColumns,
		Math.max( 0, findNearest( containerRef.current, getMouseX( mouse ), direction, totalColumns ) )
	);

	if ( direction === 'left' ) {
		// Moving the left edge of a column, so we affect both span and start
		if ( nearest === start ) {
			// No change
			return null;
		}

		// We're changing the start position - adjust the span
		const diff = Math.abs( nearest - start );
		const adjustment = {
			start: nearest,
			span: nearest > start ? span - diff : span + diff,
		};

		// Check we don't go beyond the end
		if ( adjustment.start >= start + span ) {
			return null;
		}

		// Minimum span of 1
		adjustment.span = Math.max( 1, adjustment.span );
		return adjustment;
	}

	// Moving the right edge of a column so we only affect the span
	return {
		span: Math.max( 1, nearest - start ),
	};
}

/**
 * Adjust an x position based on the limits of the grid
 *
 * @param {ResizeData} resize - Resize data
 * @param {number} offset - X position
 * @returns {number} - X position that fits within the limits
 */
function getRestrictedOffset( resize, offset ) {
	const { direction, max, width } = resize;

	// Ensure we dont go beyond or before the end of the other side of our block
	if ( direction === 'left' ) {
		return Math.min( max - width, offset );
	}

	return Math.max( max + width, offset );
}

/**
 * A resizer component that listens to mouse/touch drag events in a grid container and issues `onResize` adjustments.
 * The component should only be created when a drag event has started
 *
 * @param {object} props - Component props
 * @param {number} props.totalColumns - Total number of columns for a row in the device
 * @param {OnResize} props.onResize - Resize callback when an adjustment is made
 * @param {RenderHandler} props.renderHandle - Render a drag handle
 * @param {StopResizing} props.onStopResizing - Callback when the resize has finished
 * @param {ResizeData} props.resize - Initial resize data
 * @param {object} props.container - Node reference to resize container
 * @param {Column[]} props.columns - All columns for the selected device
 */
export default function Resizer( props ) {
	const { onStopResizing, renderHandle, totalColumns, columns, onResize, container } = props;
	const [ resize, setResize ] = useState( props.resize );

	function onMouseMove( ev ) {
		const { height, width, direction, resizingColumn } = resize;

		ev.stopPropagation();  // don't pass this anywhere else
		if ( ev.touches === undefined ) {
			ev.preventDefault();  // stop browser drag
		}

		// Update the x position
		setResize( {
			...resize,
			xPos: getRestrictedOffset( resize, getAdjustedOffset( container, getMouseX( ev ), width ) ),
			height,
		} );

		// Finally pass this up if a grid adjustment has been triggered
		const adjustment = getAdjustmentForMove( resize, container, direction, totalColumns, columns, ev );
		if ( adjustment ) {
			onResize( resizingColumn, adjustment );
		}
	}

	useEffect( () => {
		document.addEventListener( 'touchmove', onMouseMove );
		document.addEventListener( 'mousemove', onMouseMove );

		document.addEventListener( 'touchend', onStopResizing );
		document.addEventListener( 'mouseup', onStopResizing );

		return () => {
			document.removeEventListener( 'touchmove', onMouseMove );
			document.removeEventListener( 'mousemove', onMouseMove );

			document.removeEventListener( 'touchend', onStopResizing );
			document.removeEventListener( 'mouseup', onStopResizing );
		};
	}, [] );

	return renderHandle( resize );
}
