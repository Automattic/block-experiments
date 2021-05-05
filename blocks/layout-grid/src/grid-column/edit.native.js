/**
 * External dependencies
 */
import { View } from 'react-native';
/**
 * WordPress dependencies
 */
import { PanelBody, BottomSheetSelectControl } from '@wordpress/components';
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

/**
 * Internal dependencies
 */
import { getPaddingValues } from '../constants';
import styles from './edit.native.scss';

function ColumnsEdit( {
	hasChildren,
	attributes,
	isSelected,
	setAttributes,
	updateAlignment,
	isParentSelected,
} ) {
	const { padding, verticalAlignment } = attributes;

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
			<View style={ columnStyles }>
				<InnerBlocks
					templateLock={ false }
					renderAppender={
						! hasChildren || isSelected
							? () => <InnerBlocks.ButtonBlockAppender />
							: undefined
					}
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

		return {
			hasChildren,
			isParentSelected,
			isSelected,
			selectedColumnIndex,
			columns,
			parentAlignment,
		};
	} ),

	withDispatch( ( dispatch, ownProps, registry ) => {
		return {
			updateAlignment( verticalAlignment ) {
				const { clientId, setAttributes } = ownProps;
				const { updateBlockAttributes } = dispatch(
					'core/block-editor'
				);
				const { getBlockRootClientId } = registry.select(
					'core/block-editor'
				);

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
)( ColumnsEdit );
