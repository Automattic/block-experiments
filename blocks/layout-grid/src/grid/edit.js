/**
 * External dependencies
 */

import { times, pickBy, isNumber } from 'lodash';

/**
 * WordPress dependencies
 */

import { InnerBlocks } from '@wordpress/block-editor';
import { useRef } from '@wordpress/element';
import { IsolatedEventContainer } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';

/**
 * Internal dependencies
 */

import {
	getGridClasses,
	getColumnClassesForEditor,
	getGridEditorClasses,
	getGridVerticalAlignClasses,
	getColumnVerticalAlignEditorClasses,
	getGutterClasses,
} from '../grid-css';
import { getGridWidth, convertAttributesToColumn, convertColumnToAttributes } from '../grid-values';
import { changeNumberOfColumns, setDefaultGridLayout } from './change-number-columns';
import ResizeGrid from './grid-resizer';
import { getGridAdjustments, validateGridAdjustments } from './grid-adjust';
import LayoutGridPlaceholder from './placeholder';
import LayoutGridBlockControls from './block-controls';
import LayoutGridInspector from './inspector';

const ALLOWED_BLOCKS = [ 'jetpack/layout-grid-column' ];
const MINIMUM_RESIZE_SIZE = 50; // Empirically determined to be a good size

/** @typedef {import('../constants.js').Device} Device */
/** @typedef {"top" | "center" | "bottom"} VerticalAlignment */

/**
 * @callback SetDeviceCallback
 * @param {string} device - New device
 */

/**
 * @callback SetAlignmentCallback
 * @param {VerticalAlignment} alignment - New alignment
 */

/**
 * Can we resize at the current device breakpoint?
 *
 * @param {Device} device - Current device
 * @param {} overlayRef - Reference to the grid overlay
 */
function canResizeBreakpoint( device, overlayRef ) {
	if ( overlayRef && overlayRef.current ) {
		const { width } = overlayRef.current.getBoundingClientRect();

		return width / getGridWidth( device ) > MINIMUM_RESIZE_SIZE;
	}

	return false;
}

function Edit( props ) {
	const {
		className,
		attributes = {},
		isSelected,
		numberOfColumns,
		setAttributes,
		updateAlignment,
		columnAttributes,
		updateColumn,
		updateNumberColumns,
		setDeviceType,
		deviceType,
	} = props;
	const { gutterSize, addGutterEnds, verticalAlignment } = attributes;
	const overlayRef = useRef();
	const classes = getGridClasses( className, {
		...getGridEditorClasses( deviceType, canResizeBreakpoint( deviceType, overlayRef ) ),

		// The editor has all the column settings on the grid as the DOM is arranged differently
		...getColumnClassesForEditor( deviceType, columnAttributes ),

		// For the editor we need the grid vertical align as well as all the column individual aligns
		...getGridVerticalAlignClasses( verticalAlignment ),
		...getColumnVerticalAlignEditorClasses( columnAttributes ),

		...getGutterClasses( addGutterEnds, gutterSize ),
	} );

	if ( numberOfColumns === 0 ) {
		return <LayoutGridPlaceholder className={ className } changeNumberOfColumns={ updateNumberColumns } />;
	}

	// Convert our attributes into column details
	function getColumn( device, column ) {
		if ( columnAttributes[ column ] ) {
			return convertAttributesToColumn( device, columnAttributes[ column ] );
		}
		debugger;
		return null;
	}

	function setColumn( device, columnNumber, attributesToAdjust ) {
		// Convert all the columns to grid format
		const columns = columnAttributes.map( ( column, pos ) => getColumn( device, pos ) );

		// Get a set of adjustments (this adjustment could cause other columns to adjust)
		const adjustments = getGridAdjustments( columns, attributesToAdjust, columnNumber );

		if (
			adjustments.length > 0 &&
			validateGridAdjustments( columns, adjustments, getGridWidth( device ) )
		) {
			// Apply adjustments to column
			adjustments.forEach( ( adjustment ) => {
				updateColumn( adjustment.column, convertColumnToAttributes( device, adjustment ) );
			} );
		}
	}

	return (
		<>
			<IsolatedEventContainer>
				<ResizeGrid
					className={ classes }
					onResize={ ( columnNumber, adjustment ) => setColumn( deviceType, columnNumber, adjustment ) }
					totalColumns={ getGridWidth( deviceType ) }
					isSelected={ isSelected }
					columns={ times( numberOfColumns, ( count ) => getColumn( deviceType, count ) ) }
				>
					<div className="wpcom-overlay-grid" ref={ overlayRef }>
						{ times( getGridWidth( deviceType ) ).map( ( item ) => (
							<div className="wpcom-overlay-grid__column" key={ item }></div>
						) ) }
					</div>

					<InnerBlocks template={ null } templateLock="all" allowedBlocks={ ALLOWED_BLOCKS } />
				</ResizeGrid>
			</IsolatedEventContainer>

			<LayoutGridInspector
				device={ deviceType }
				setDevice={ setDeviceType }
				gutterSize={ gutterSize }
				addGutterEnds={ addGutterEnds }
				setAttributes={ setAttributes }
				getColumn={ getColumn }
				columnCount={ numberOfColumns }
				changeColumn={ setColumn }
				changeNumberOfColumns={ updateNumberColumns }
			/>

			<LayoutGridBlockControls
				device={ deviceType }
				setDevice={ setDeviceType }
				verticalAlignment={ verticalAlignment }
				setVerticalAlignment={ updateAlignment }
			/>
		</>
	);
}

export default compose( [
	withDispatch(
		/**
		 * @param {{clientId: string, attributes: object, name: string, columns: number}} ownProps - Our own props
		 */
		( dispatch, ownProps, registry ) => ( {
			/**
			 * Update all child Column blocks with a new vertical alignment setting
			 * based on whatever alignment is passed in. This allows change to parent
			 * to overide anything set on a individual column basis.
			 *
			 * @param {string} verticalAlignment the vertical alignment setting
			 */
			updateAlignment( verticalAlignment ) {
				const { clientId, setAttributes } = ownProps;
				const { updateBlockAttributes } = dispatch( 'core/block-editor' );
				const { getBlockOrder } = registry.select( 'core/block-editor' );

				// Update own alignment.
				setAttributes( { verticalAlignment } );

				// Update all child Column Blocks to match
				const innerBlockClientIds = getBlockOrder( clientId );
				innerBlockClientIds.forEach( ( innerBlockClientId ) => {
					updateBlockAttributes( innerBlockClientId, {
						verticalAlignment,
					} );
				} );
			},

			updateColumn( columnNumber, attributes ) {
				const { updateBlockAttributes } = dispatch( 'core/block-editor' );
				const { getBlockOrder } = registry.select( 'core/block-editor' );

				// Update all child Column Blocks to match
				const innerBlockClientIds = getBlockOrder( ownProps.clientId );

				updateBlockAttributes( innerBlockClientIds[ columnNumber ], pickBy( attributes, isNumber ) );
			},

			/**
			 * Change the number of columns
			 *
			 * @param {number} columnCount - New column count
			 */
			updateNumberColumns( columnCount ) {
				const { clientId } = ownProps;
				const { replaceInnerBlocks } = dispatch( 'core/block-editor' );
				const { getBlocks } = registry.select( 'core/block-editor' );

				// Replace the whole block with a new one so that our changes to both the attributes and innerBlocks are atomic
				// This ensures that the undo history has a single entry, preventing traversing to a 'half way' point where innerBlocks are changed
				// but the column attributes arent
				const blockCopy = setDefaultGridLayout( changeNumberOfColumns( getBlocks( clientId ), columnCount ) );

				replaceInnerBlocks( clientId, blockCopy );
			},

			setDeviceType( type ) {
				const { __experimentalSetPreviewDeviceType } = dispatch( 'core/edit-post' );

				__experimentalSetPreviewDeviceType( type );
			},
		} )
	),
	withSelect( ( select, { clientId } ) => {
		const { getBlockOrder, getBlockCount, getBlocksByClientId } = select( 'core/block-editor' );

		return {
			numberOfColumns: getBlockCount( clientId ),
			columnAttributes: getBlockOrder( clientId ).map(
				( innerBlockClientId ) => getBlocksByClientId( innerBlockClientId )[ 0 ].attributes
			),
			deviceType: select( 'core/edit-post' ).__experimentalGetPreviewDeviceType(),
		};
	} ),
] )( Edit );
