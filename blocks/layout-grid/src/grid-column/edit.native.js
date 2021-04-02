/**
 * WordPress dependencies
 */
import { PanelBody, BottomSheetSelectControl } from '@wordpress/components';
import {
	InnerBlocks,
	InspectorControls,
	BlockControls,
	BlockVerticalAlignmentToolbar,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { getPaddingValues } from '../constants';

class Edit extends Component {
	render() {
		const {
			hasChildBlocks,
			attributes,
			isSelected,
			setAttributes,
			updateAlignment,
		} = this.props;
		const { padding, verticalAlignment } = attributes;

		return (
			<>
				<InnerBlocks
					templateLock={ false }
					renderAppender={
						hasChildBlocks && isSelected
							? undefined
							: () => <InnerBlocks.ButtonBlockAppender />
					}
				/>
				<InspectorControls>
					<PanelBody>
						<BottomSheetSelectControl
							label={ __( 'Column Padding', 'layout-grid' ) }
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
}

export default compose(
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
)( Edit );
