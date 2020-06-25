/**
 * WordPress dependencies
 */

import {
	InnerBlocks,
	InspectorControls,
	PanelColorSettings,
	withColors,
	BlockControls,
	BlockVerticalAlignmentToolbar,
	getColorClassName,
} from '@wordpress/block-editor';
import { compose } from '@wordpress/compose';
import { useState } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { PanelBody, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getPaddingValues } from '../constants';
import { getGridClasses, getBackgroundClasses, getColumnVerticalAlignClasses, getPaddingClasses } from '../grid-css';

function Edit( props ) {
	const {
		className,
		hasChildBlocks,
		backgroundColor,
		setBackgroundColor,
		attributes,
		setAttributes,
		updateAlignment,
	} = props;
	const { padding, verticalAlignment } = attributes;
	const [ direction, setDirection ] = useState( null );
	const backgroundClass = getColorClassName( 'background-color', backgroundColor );
	const classes = getGridClasses( className, {
		...getBackgroundClasses( backgroundColor, backgroundClass ),
		...getColumnVerticalAlignClasses( verticalAlignment ),
		...getPaddingClasses( padding ),

		'components-resizable-box__container': true,
		'wp-blocks-jetpack-layout-grid__showleft': direction === 'right',
		'wp-blocks-jetpack-layout-grid__showright': direction === 'left',
	} );


	const style = {
		backgroundColor: backgroundColor.color,
	};

	function changeDirectionEnd() {
		setDirection( null );

		document.removeEventListener( 'mouseup', changeDirectionEnd );
	}

	function changeDirectionStart( direction ) {
		setDirection( direction );

		document.addEventListener( 'mouseup', changeDirectionEnd );
	}

	// Note we wrap the InnerBlock with 'fake' resize handles. These are here so they always match the current column dimensions. Functionally
	// they do nothing other than disappear when the mouse button is pressed. The real resizing happens in the ResizeGrid component.
	// We identify the left and right handles by data-resize-left and data-resize-right
	// TODO: remove this data stuff and the DOM crawling
	return (
		<div className={ classes } style={ style }>
			<span className="wp-blocks-jetpack-layout-grid__resize-handles">
				<div
					className="components-resizable-box__handle components-resizable-box__side-handle components-resizable-box__handle-right"
					onMouseDown={ () => changeDirectionStart( 'right' ) }
					data-resize-right
				></div>
				<div
					className="components-resizable-box__handle components-resizable-box__side-handle components-resizable-box__handle-left"
					onMouseDown={ () => changeDirectionStart( 'left' ) }
					data-resize-left
				></div>
			</span>

			<InnerBlocks
				templateLock={ false }
				renderAppender={ hasChildBlocks ? undefined : () => <InnerBlocks.ButtonBlockAppender /> }
			/>

			<InspectorControls>
				<PanelColorSettings
					title={ __( 'Column Color', 'layout-grid' ) }
					initialOpen
					colorSettings={ [
						{
							value: backgroundColor.color,
							onChange: setBackgroundColor,
							label: __( 'Background', 'layout-grid' ),
						},
					] }
				/>

				<PanelBody title={ __( 'Column Padding', 'layout-grid' ) }>
					<p>{ __( 'Choose padding for this column:', 'layout-grid' ) }</p>
					<SelectControl
						value={ padding }
						onChange={ ( newValue ) => setAttributes( { padding: newValue } ) }
						options={ getPaddingValues() }
					/>
				</PanelBody>
			</InspectorControls>

			<BlockControls>
				<BlockVerticalAlignmentToolbar onChange={ updateAlignment } value={ verticalAlignment } />
			</BlockControls>
		</div>
	);
}

export default compose(
	withColors( 'backgroundColor' ),
	withSelect( ( select, ownProps ) => {
		const { clientId } = ownProps;
		const { getBlockOrder } = select( 'core/block-editor' );

		return {
			hasChildBlocks: getBlockOrder( clientId ).length > 0,
		};
	} ),
	withDispatch( ( dispatch, ownProps, registry ) => {
		return {
			updateAlignment( verticalAlignment ) {
				const { clientId, setAttributes } = ownProps;
				const { updateBlockAttributes } = dispatch( 'core/block-editor' );
				const { getBlockRootClientId } = registry.select( 'core/block-editor' );

				// Update own alignment.
				setAttributes( { verticalAlignment } );

				// Reset Parent Columns Block
				const rootClientId = getBlockRootClientId( clientId );
				updateBlockAttributes( rootClientId, {
					verticalAlignment: null,
				} );
			},
		};
	} )
)( Edit );
