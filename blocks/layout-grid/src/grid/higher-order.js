/**
 * WordPress dependencies
 */
import { withSelect, withDispatch } from '@wordpress/data';

/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { removeGridClasses } from './css-classname';

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

export function withUpdateAlignment() {
	return withDispatch( ( dispatch, ownProps, registry ) => {
		return {
			/**
			 * Update all child Column blocks with a new vertical alignment setting
			 * based on whatever alignment is passed in. This allows change to parent
			 * to overide anything set on a individual column basis.
			 *
			 * @param {string} verticalAlignment the vertical alignment setting
			 */
			updateAlignment( verticalAlignment ) {
				const { clientId, setAttributes } = ownProps;
				const { updateBlockAttributes } = dispatch(
					'core/block-editor'
				);
				const { getBlockOrder } = registry.select(
					'core/block-editor'
				);

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
		};
	} );
}

export function withUpdateColumns() {
	return withDispatch( ( dispatch, ownProps, registry ) => {
		return {
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
		};
	} );
}

export function withSetPreviewDeviceType() {
	return withDispatch( ( dispatch ) => {
		return {
			setPreviewDeviceType( type ) {
				const { __experimentalSetPreviewDeviceType } = dispatch(
					'core/edit-post'
				);
				__experimentalSetPreviewDeviceType( type );
			},
		};
	} );
}

export function withColumns() {
	return withSelect( ( select, { clientId } ) => {
		const { getBlockCount } = select( 'core/block-editor' );

		return {
			columns: getBlockCount( clientId ),
		};
	} );
}

export function withColumnAttributes() {
	return withSelect( ( select, { clientId } ) => {
		const { getBlockOrder, getBlocksByClientId } = select(
			'core/block-editor'
		);

		return {
			columnAttributes: getBlockOrder( clientId ).map(
				( innerBlockClientId ) =>
					getBlocksByClientId( innerBlockClientId )[ 0 ].attributes
			),
		};
	} );
}

export function withPreviewDeviceType() {
	return withSelect( ( select ) => {
		const { __experimentalGetPreviewDeviceType = null } = select(
			'core/edit-post'
		);

		return {
			previewDeviceType: __experimentalGetPreviewDeviceType(),
		};
	} );
}
