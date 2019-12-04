/**
 * External dependencies
 */

import classnames from 'classnames';

const ResizeHandle = ( { height, xPos, top, isSelected } ) => {
	const classes = classnames( 'wpcom-overlay-resize__handle', 'components-resizable-box__container', {
		'is-selected': isSelected,
	} );
	const wrapStyle = {
		height: height + 'px',
		width: xPos + 'px',
		top: top + 'px',
	};
	const dragStyle = {
		left: xPos + 'px',
	};

	return (
		<div className={ classes } style={ wrapStyle }>
			<span>
				<div className="components-resizable-box__handle components-resizable-box__side-handle components-resizable-box__handle-left" style={ dragStyle }></div>
			</span>
		</div>
	);
};

export default ResizeHandle;
