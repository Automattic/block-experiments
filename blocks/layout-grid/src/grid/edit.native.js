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
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import variations from './variations';
import VariationControl from './variation-control';
import {
	DEVICE_BREAKPOINTS,
	getSpanForDevice,
	getOffsetForDevice,
} from './../constants';
import { getDefaultSpan } from './grid-defaults';
import {
	withUpdateAlignment,
	withUpdateColumns,
	withColumns,
	withColumnAttributes,
} from './higher-order';

const ALLOWED_BLOCKS = [ 'jetpack/layout-grid-column' ];

const DEFAULT_TEMPLATE = [
	[ 'jetpack/layout-grid-column', {}, [] ],
	[ 'jetpack/layout-grid-column', {}, [] ],
];

function ColumnsEdit( {
	clientId,
	attributes = {},
	columns,
	updateAlignment,
	updateColumns,
} ) {
	const { verticalAlignment } = attributes;

	const [ isDefaultColumns, setDefaultColumns ] = useState( ! columns );

	const onChangeLayout = ( selectedColumn ) => {
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
		setDefaultColumns( false );
		updateColumns( columns, numberOfColumns, columnValues );
	};

	return (
		<>
			<View>
				<InnerBlocks
					template={ isDefaultColumns ? DEFAULT_TEMPLATE : null }
					templateLock="all"
					allowedBlocks={ ALLOWED_BLOCKS }
				/>
			</View>
			<InspectorControls>
				<PanelBody title={ __( 'Layout', 'layout-grid' ) }>
					<VariationControl.Inner
						variations={ variations }
						onChange={ onChangeLayout }
					/>
				</PanelBody>
			</InspectorControls>
			<BlockControls>
				<BlockVerticalAlignmentToolbar
					onChange={ updateAlignment }
					value={ verticalAlignment }
				/>
			</BlockControls>
			<VariationControl
				variations={ variations }
				onClose={ () => {
					setDefaultColumns( false );
				} }
				clientId={ clientId }
				onChange={ onChangeLayout }
				hasLeftButton={ true }
				isVisible={ isDefaultColumns }
			/>
		</>
	);
}

export default compose( [
	withUpdateAlignment(),
	withUpdateColumns(),
	withColumns(),
	withColumnAttributes(),
] )( ColumnsEdit );
