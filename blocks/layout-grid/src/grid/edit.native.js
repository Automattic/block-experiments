/**
 * External dependencies
 */
import { View } from 'react-native';
/**
 * WordPress dependencies
 */
import {
	InnerBlocks,
	InspectorControls,
	BlockControls,
	BlockVerticalAlignmentToolbar,
} from '@wordpress/block-editor';

import { Component, createRef } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import variations from './variations';
import { removeGridClasses } from './css-classname';
import VariationControl from './variation-control';
import {
	DEVICE_BREAKPOINTS,
	getSpanForDevice,
	getOffsetForDevice,
} from './../constants';
import { getDefaultSpan } from './grid-defaults';
const ALLOWED_BLOCKS = [ 'jetpack/layout-grid-column' ];

const DEFAULT_TEMPLATE = [
	[ 'jetpack/layout-grid-column', {}, [] ],
	[ 'jetpack/layout-grid-column', {}, [] ],
];

class Edit extends Component {
	constructor( props ) {
		super( props );

		this.overlayRef = createRef();
		this.state = { isDefaultColumns: ! props.columns };

		this.setNotDefaultColumns = this.setNotDefaultColumns.bind( this );
		this.onChangeLayout = this.onChangeLayout.bind( this );
	}

	setNotDefaultColumns() {
		this.setState( { isDefaultColumns: false } );
	}

	onChangeLayout( selectedColumn ) {
		const columnValues = {};
		const numberOfColumns = selectedColumn.innerBlocks.length;
		for ( let pos = 0; pos < numberOfColumns; pos++ ) {
			for (
				let device = 0;
				device < DEVICE_BREAKPOINTS.length;
				device++
			) {
				const defaultSpan = getDefaultSpan(
					DEVICE_BREAKPOINTS[ device ],
					numberOfColumns,
					pos
				);

				columnValues[
					getSpanForDevice( pos, DEVICE_BREAKPOINTS[ device ] )
				] = defaultSpan;
				columnValues[
					getOffsetForDevice( pos, DEVICE_BREAKPOINTS[ device ] )
				] = 0;
			}
		}
		this.setState( { isDefaultColumns: false } );

		this.props.updateColumns(
			this.props.columns,
			numberOfColumns,
			columnValues
		);
	}

	render() {
		const { clientId, attributes = {}, updateAlignment } = this.props;

		const { verticalAlignment } = attributes;

		return (
			<>
				<View>
					<InnerBlocks
						template={
							this.state.isDefaultColumns
								? DEFAULT_TEMPLATE
								: null
						}
						templateLock="all"
						allowedBlocks={ ALLOWED_BLOCKS }
					/>
				</View>
				<InspectorControls>
					<VariationControl
						variations={ variations }
						clientId={ clientId }
						onClose={ () => {} }
						isVisible={ true }
						hasLeftButton={ false }
						onChange={ this.onChangeLayout }
					/>
				</InspectorControls>
				<BlockControls>
					<BlockVerticalAlignmentToolbar
						onChange={ updateAlignment }
						value={ verticalAlignment }
					/>
				</BlockControls>
				<VariationControl
					variations={ variations }
					onClose={ this.setNotDefaultColumns }
					clientId={ clientId }
					onChange={ this.onChangeLayout }
					hasLeftButton={ true }
					isVisible={ this.state.isDefaultColumns }
				/>
			</>
		);
	}
}

function getColumnBlocks( currentBlocks, previous, columns ) {
	if ( columns > previous ) {
		// Add new blocks to the end
		return [
			...currentBlocks,
			...Array.from( { length: columns - previous }, () =>
				createBlock( 'jetpack/layout-grid-column' )
			),
		];
	}

	// A little ugly but... ideally we remove empty blocks first, and then anything with content from the end
	let cleanedBlocks = [ ...currentBlocks ];
	let totalRemoved = 0;

	// Reverse the blocks so we start at the end. This happens in-place
	cleanedBlocks.reverse();

	// Remove empty blocks
	cleanedBlocks = cleanedBlocks.filter( ( block ) => {
		if (
			totalRemoved < previous - columns &&
			block.innerBlocks.length === 0
		) {
			totalRemoved++;
			return false;
		}

		return true;
	} );

	// If we still need to remove blocks then do them from the beginning before flipping it back round
	return cleanedBlocks
		.slice( Math.max( 0, previous - columns - totalRemoved ) )
		.reverse();
}

export default compose( [
	withDispatch( ( dispatch, ownProps, registry ) => ( {
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
		updateColumns( previous, columns, columnValues ) {
			const { clientId } = ownProps;
			const { replaceBlock } = dispatch( 'core/block-editor' );
			const { getBlocks } = registry.select( 'core/block-editor' );
			const innerBlocks = getColumnBlocks(
				getBlocks( clientId ),
				previous,
				columns
			);

			// Replace the whole block with a new one so that our changes to both the attributes and innerBlocks are atomic
			// This ensures that the undo history has a single entry, preventing traversing to a 'half way' point where innerBlocks are changed
			// but the column attributes arent
			const blockCopy = createBlock(
				ownProps.name,
				{
					...ownProps.attributes,
					...columnValues,
					className: removeGridClasses(
						ownProps.attributes.className
					),
				},
				innerBlocks
			);

			replaceBlock( clientId, blockCopy );
		},
	} ) ),

	withSelect( ( select, { clientId } ) => {
		const { getBlockOrder, getBlockCount, getBlocksByClientId } = select(
			'core/block-editor'
		);
		return {
			columns: getBlockCount( clientId ),
			columnAttributes: getBlockOrder( clientId ).map(
				( innerBlockClientId ) =>
					getBlocksByClientId( innerBlockClientId )[ 0 ].attributes
			),
		};
	} ),
] )( Edit );
