/**
 * Adjust an offset by the grid top
 *
 * @param {number} offset
 * @param {object} containerRef
 * @returns {number}
 */
export function getAdjustedTop( offset, containerRef ) {
	return offset - containerRef.current.getBoundingClientRect().top;
}

/**
 * Get an X client position from the mouse or touch
 *
 * @param {object} event
 * @returns {number}
 */
export function getMouseX( event ) {
	const { clientX, targetTouches } = event;

	return clientX || ( targetTouches && targetTouches[ 0 ].clientX );
}

/**
 * Adjust an X position by the container and handle
 *
 * @param {object} containerRef
 * @param {number} offset
 * @param {number} currentWidth
 * @returns {number}
 */
export function getAdjustedOffset( containerRef, offset, currentWidth ) {
	return offset - containerRef.current.getBoundingClientRect().left - currentWidth / 2;
}
