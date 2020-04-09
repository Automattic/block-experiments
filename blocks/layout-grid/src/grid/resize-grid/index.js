/**
 * External dependencies
 */

import classnames from 'classnames';

/**
 * WordPress dependencies
 */

import { Component, createRef } from '@wordpress/element';

/**
 * Internal dependencies
 */

import findNearest from './nearest';
import ResizeHandle from './resize-handle';

/*
 * The ResizeGrid is responsible for providing resizable grid column handles. It maps absolute mouse positions to grid columns, and then
 * validates that with the LayoutGrid.
 *
 * Due to the way the Gutenberg DOM is laid out, the ResizeGrid doesn't provide the resize handles that surround a column. Instead it
 * listens for mousedown events and when one happens it then displays a 'fake' resize handle that can be dragged. As the fake handle is
 * moved, the underlying grid is updated, giving the appearance it is being directly updated.
 */
class ResizeGrid extends Component {
	constructor( props ) {
		super( props );

		this.containerRef = createRef();
		this.state = {
			resizingColumn: -1,
			xPos: 0,
			height: 0,
		};
	}

	getNearestColumn( direction, mouse ) {
		const { totalColumns, layoutGrid } = this.props;
		const start = layoutGrid.getStart( this.state.resizingColumn );
		const span = layoutGrid.getSpan( this.state.resizingColumn );
		const nearest = Math.min( totalColumns, Math.max( 0, findNearest( this.containerRef.current, this.getMouseX( mouse ), direction, totalColumns ) ) );

		if ( direction === 'left' ) {
			if ( nearest === start ) {
				// No change
				return null;
			}

			// We're changing the start position - adjust the span
			const diff = Math.abs( nearest - start );
			const adjustment = {
				start: nearest,
				span: nearest > start ? span - diff : span + diff,
				direction,
			};

			// Check we don't go beyond the end
			if ( adjustment.start >= start + span ) {
				return null;
			}

			// Minimum span of 1
			adjustment.span = Math.max( 1, adjustment.span );
			return adjustment;
		}

		// We're changing the span
		// New span is from the new position minus the current start
		return {
			span: Math.max( 1, nearest - start ),
			direction,
		};
	}

	getMouseX( event ) {
		const { clientX, targetTouches } = event;

		return clientX || ( targetTouches && targetTouches[ 0 ].clientX );
	}

	getAdjustedOffset( offset, optionalWidth = 0 ) {
		const { width } = this.state;
		const handleWidth = optionalWidth > 0 ? optionalWidth : width;

		return offset - this.containerRef.current.getBoundingClientRect().left - ( ( handleWidth ) / 2 );
	}

	getAdjustedTop( offset ) {
		return offset - this.containerRef.current.getBoundingClientRect().top;
	}

	getRestrictedOffset( offset ) {
		const { direction, max, width } = this.state;

		// Ensure we dont go beyond or before the end of the other side of our block
		if ( direction === 'left' ) {
			return Math.min( max - width, offset );
		}

		return Math.max( max + width, offset );
	}

	getChildPosition( element ) {
		let pos = 0;

		while ( element.previousSibling !== null ) {
			element = element.previousSibling;
			pos++;
		}

		return pos;
	}

	onMouseDown = ev => {
		const { target } = ev;

		// This is a bit of hardcoded DOM searching - we check if the current click is on a resize handle and then find the column associated with that
		// There may be a better way.
		if ( ( ev.button === 0 || ev.touches ) && ( target.dataset.resizeRight || target.dataset.resizeLeft ) ) {
			this.block = target.closest( '.wp-block' );

			const { height, right, left, top } = this.block.getBoundingClientRect();
			const { width } = target.getBoundingClientRect();
			const pos = this.getChildPosition( this.block );
			const isLeft = target.dataset.resizeLeft;

			this.setState( {
				resizingColumn: pos,
				xPos: this.getAdjustedOffset( this.getMouseX( ev ), width ),
				height,
				width,
				top: this.getAdjustedTop( top ),
				direction: isLeft ? 'left' : 'right',
				max: isLeft ? this.getAdjustedOffset( right, width ) : this.getAdjustedOffset( left, width ),
			} );

			if ( ev.button === 0 ) {
				document.addEventListener( 'mousemove', this.onMouseMove );
				document.addEventListener( 'mouseup', this.onMouseUp );

				ev.preventDefault();
			} else {
				document.addEventListener( 'touchmove', this.onMouseMove );
				document.addEventListener( 'touchend', this.onMouseUp );
			}

			ev.stopPropagation();
		}
	}

	onMouseMove = ev => {
		ev.stopPropagation();

		if ( ev.touches === undefined ) {
			ev.preventDefault();
		}

		const { height } = this.block.getBoundingClientRect();

		this.setState( {
			xPos: this.getRestrictedOffset( this.getAdjustedOffset( this.getMouseX( ev ) ) ),
			height,
		} );

		// Finally pass this up if a grid adjustment has been triggered
		const adjustment = this.getNearestColumn( this.state.direction, ev );
		if ( adjustment ) {
			this.props.onResize( this.state.resizingColumn, adjustment );
		}
	}

	onMouseUp = ev => {
		this.setState( { resizingColumn: -1 } );

		document.removeEventListener( 'mousemove', this.onMouseMove );
		document.removeEventListener( 'mouseup', this.onMouseUp );
		document.removeEventListener( 'touchmove', this.onMouseMove );
		document.removeEventListener( 'touchend', this.onMouseUp );
	}

	render() {
		const { className, children, isSelected } = this.props;
		const { resizingColumn, xPos, height } = this.state;
		const classes = classnames(
			className,
			resizingColumn !== -1 ? 'wp-block-jetpack-layout-grid__resizing' : null,
		);

		return (
			<div className={ classes } onMouseDown={ this.onMouseDown } onTouchStart={ this.onMouseDown } ref={ this.containerRef }>
				{ resizingColumn !== -1 && <ResizeHandle direction={ this.state.direction } height={ height } xPos={ xPos } top={ this.state.top } isSelected={ isSelected } /> }
				{ children }
			</div>
		);
	}
}

export default ResizeGrid;
