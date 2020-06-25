/**
 * External dependencies
 */

import classnames from 'classnames';

const ResizeHandle = ( { direction, height, xPos, top, isSelected } ) => {
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


	const handleClasses = classnames(
		'components-resizable-box__handle',
		'components-resizable-box__side-handle',
		{
			'components-resizable-box__handle-left': direction === 'left',
			'components-resizable-box__handle-right': direction === 'right',
		}
	);

	return (
		<div className={ classes } style={ wrapStyle }>
			<span>
				<div className={ handleClasses } style={ dragStyle }></div>
			</span>
		</div>
	);
};

export default ResizeHandle;
