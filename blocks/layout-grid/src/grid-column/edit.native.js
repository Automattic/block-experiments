/**
 * External dependencies
 */
import { View, Dimensions } from 'react-native';
/**
 * WordPress dependencies
 */
import { PanelBody, BottomSheetSelectControl } from '@wordpress/components';
import { withViewportMatch } from '@wordpress/viewport';
import {
	InnerBlocks,
	InspectorControls,
	BlockControls,
	BlockVerticalAlignmentToolbar,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose, usePreferredColorSchemeStyle } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getPaddingValues } from '../constants';
import { withUpdateAlignment } from './higher-order';
import styles from './edit.native.scss';

/**
 * Calculate the column styles.
 *
 * @param {int} columns
 * @param {int} index
 * @param {int} fullWidth
 * @param {string} viewport
 * @returns
 */
function getColumnStyles( columns, index, fullWidth, viewport ) {
	// Default widths for 1 column layout.
	let widths = {
		mobile: fullWidth,
		tablet: fullWidth,
		desktop: fullWidth,
	};

	switch ( columns ) {
		case 2:
			widths = {
				mobile: fullWidth,
				tablet: Math.floor( fullWidth / 2 ) - 16,
				desktop: Math.floor( fullWidth / 2 ) - 16,
			};
			break;
		case 3:
			widths = {
				mobile: fullWidth,
				tablet: Math.floor( fullWidth / 2 ) - 16,
				desktop: Math.floor( fullWidth / 3 ) - 26,
			};
			if ( index === 2 ) {
				widths.tablet = fullWidth - 4;
			}
			break;
		case 4:
			widths = {
				mobile: fullWidth,
				tablet: Math.floor( fullWidth / 2 ) - 16,
				desktop: Math.floor( fullWidth / 4 ) - 26,
			};
			break;
	}

	return { width: widths[ viewport ] };
}

function ColumnsEdit( {
	hasChildren,
	attributes,
	isSelected,
	setAttributes,
	updateAlignment,
	isParentSelected,
	selectedColumnIndex,
	parentWidth,
	isMobile,
	isTablet,
	parentColumnCount,
} ) {
	const { padding, verticalAlignment } = attributes;

	let viewportSize = 'desktop';
	if ( isTablet ) {
		viewportSize = 'tablet';
	}
	if ( isMobile ) {
		viewportSize = 'isMobile';
	}

	const calculatedColumnStyles = getColumnStyles(
		parentColumnCount,
		selectedColumnIndex,
		parentWidth,
		viewportSize
	);

	if ( ! isSelected && ! hasChildren ) {
		return (
			<View
				style={ [
					! isParentSelected &&
						usePreferredColorSchemeStyle(
							styles[ 'column__placeholder' ],
							styles[ 'column__placeholder-dark' ]
						),
					styles[ 'column__placeholder-not-selected' ],
					calculatedColumnStyles,
				] }
			/>
		);
	}

	let columnStyles = styles[ 'column__padding-' + padding ];
	if ( isSelected && 'none' === padding ) {
		columnStyles = styles[ 'column__padding-none-is-selected' ];
	}

	return (
		<>
			<View style={ [ columnStyles, calculatedColumnStyles ] }>
				<InnerBlocks
					templateLock={ false }
					renderAppender={
						! hasChildren || isSelected
							? () => (
									<View
										style={ styles[ 'column__appender' ] }
									>
										<InnerBlocks.ButtonBlockAppender />
									</View>
							  )
							: undefined
					}
					parentWidth={ calculatedColumnStyles.width }
					blockWidth={ calculatedColumnStyles.width }
				/>
			</View>
			<InspectorControls>
				<PanelBody title={ __( 'Column Settings', 'layout-grid' ) }>
					<BottomSheetSelectControl
						label={ __( 'Padding', 'layout-grid' ) }
						value={ padding }
						onChange={ ( newValue ) =>
							setAttributes( { padding: newValue } )
						}
						options={ getPaddingValues() }
					/>
				</PanelBody>
			</InspectorControls>

			<BlockControls>
				<BlockVerticalAlignmentToolbar
					onChange={ updateAlignment }
					value={ verticalAlignment }
				/>
			</BlockControls>
		</>
	);
}

export default compose(
	withSelect( ( select, { clientId } ) => {
		const {
			getBlockCount,
			getBlockRootClientId,
			getSelectedBlockClientId,
			getBlocks,
			getBlockOrder,
			getBlockAttributes,
		} = select( blockEditorStore );

		const selectedBlockClientId = getSelectedBlockClientId();
		const isSelected = selectedBlockClientId === clientId;

		const parentId = getBlockRootClientId( clientId );
		const hasChildren = !! getBlockCount( clientId );
		const isParentSelected =
			selectedBlockClientId && selectedBlockClientId === parentId;

		const blockOrder = getBlockOrder( parentId );

		const selectedColumnIndex = blockOrder.indexOf( clientId );
		const columns = getBlocks( parentId );

		const parentAlignment = getBlockAttributes( parentId )
			?.verticalAlignment;

		const parentColumnCount = getBlockCount( parentId );

		return {
			hasChildren,
			isParentSelected,
			isSelected,
			selectedColumnIndex,
			columns,
			parentAlignment,
			parentColumnCount,
		};
	} ),
	withUpdateAlignment(),
	withViewportMatch( { isMobile: '< small', isTablet: '< large' } )
)( ColumnsEdit );
