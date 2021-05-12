/**
 * External dependencies
 */
import { View } from 'react-native';

/**
 * WordPress dependencies
 */
import {
	PanelBody,
	BottomSheetSelectControl,
	alignmentHelpers,
} from '@wordpress/components';
import { withViewportMatch } from '@wordpress/viewport';
import {
	InnerBlocks,
	InspectorControls,
	BlockControls,
	BlockVerticalAlignmentToolbar,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { compose, usePreferredColorSchemeStyle } from '@wordpress/compose';

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
 * @return {object}
 */
function getColumnStyles( columns, index, fullWidth, viewport ) {
	// Default widths for 1 column layout.
	let widths = {
		mobile: fullWidth,
		tablet: fullWidth,
		desktop: fullWidth,
	};
	const TWO_COLUMN_MARGIN = 16;
	const THREE_COLUMN_MARGIN = 21;
	const FOUR_COLUMN_MARGIN = 24;

	switch ( columns ) {
		case 2:
			widths = {
				mobile: fullWidth,
				tablet: Math.floor( fullWidth / 2 ) - TWO_COLUMN_MARGIN,
				desktop: Math.floor( fullWidth / 2 ) - TWO_COLUMN_MARGIN,
			};
			break;
		case 3:
			widths = {
				mobile: fullWidth,
				tablet: Math.floor( fullWidth / 2 ) - TWO_COLUMN_MARGIN,
				desktop: Math.floor( fullWidth / 3 ) - THREE_COLUMN_MARGIN,
			};
			if ( index === 2 ) {
				widths.tablet = fullWidth;
			}
			break;
		case 4:
			widths = {
				mobile: fullWidth,
				tablet: Math.floor( fullWidth / 2 ) - TWO_COLUMN_MARGIN,
				desktop: Math.floor( fullWidth / 4 ) - FOUR_COLUMN_MARGIN,
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
	parentAlign,
	parentColumnCount,
} ) {
	const { padding, verticalAlignment } = attributes;

	const { isFullWidth } = alignmentHelpers;

	let viewportSize = 'desktop';
	if ( isTablet ) {
		viewportSize = 'tablet';
	}
	if ( isMobile ) {
		viewportSize = 'mobile';
	}

	const stylePlaceholder = usePreferredColorSchemeStyle(
		styles.column__placeholder,
		styles[ 'column__placeholder-dark' ]
	);

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
					! isParentSelected && stylePlaceholder,
					styles[ 'column__placeholder-not-selected' ],
					calculatedColumnStyles,
				] }
			/>
		);
	}

	const columnPadding =
		isSelected && 'none' === padding
			? styles[ 'column__padding-none-is-selected' ]
			: styles[ 'column__padding-' + padding ];

	const appenderStyle = hasChildren
		? styles[ 'column__appender-has-children' ]
		: styles.column__appender;

	return (
		<>
			<View style={ [ columnPadding, calculatedColumnStyles ] }>
				<InnerBlocks
					templateLock={ false }
					renderAppender={
						! hasChildren || isSelected
							? () => (
									<View
										style={
											isFullWidth( parentAlign )
												? appenderStyle
												: [
														appenderStyle,
														styles[
															'column__appender-not-full-width'
														],
												  ]
										}
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

		const parentAlign = getBlockAttributes( parentId )?.align;
		const parentColumnCount = getBlockCount( parentId );

		return {
			hasChildren,
			isParentSelected,
			isSelected,
			selectedColumnIndex,
			columns,
			parentAlign,
			parentColumnCount,
		};
	} ),
	withUpdateAlignment(),
	withViewportMatch( { isMobile: '< small', isTablet: '< large' } )
)( ColumnsEdit );
