/**
 * External dependencies
 */
import { View, Dimensions } from 'react-native';
/**
 * WordPress dependencies
 */
import {
	InnerBlocks,
	InspectorControls,
	BlockControls,
	BlockVerticalAlignmentToolbar,
} from '@wordpress/block-editor';
import { PanelBody, alignmentHelpers } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { compose, useResizeObserver } from '@wordpress/compose';
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
import styles from './edit.native.scss';

const ALLOWED_BLOCKS = [ 'jetpack/layout-grid-column' ];

const DEFAULT_TEMPLATE = [
	[ 'jetpack/layout-grid-column', {}, [] ],
	[ 'jetpack/layout-grid-column', {}, [] ],
];

const { isFullWidth } = alignmentHelpers;

function ColumnsEdit( {
	clientId,
	attributes = {},
	columns,
	updateAlignment,
	updateColumns,
} ) {
	const { verticalAlignment, align } = attributes;

	const [ isDefaultColumns, setDefaultColumns ] = useState( ! columns );

	const [ resizeListener, sizes ] = useResizeObserver();
	const { width } = sizes || {};

	const onChangeLayout = ( selectedColumn ) => {
		const columnValues = {};
		const numberOfColumns = selectedColumn.innerBlocks.length;
		// An array containing the [ 0, 1 ... numberOfColumns ]
		const columnsArray = [ ...Array( numberOfColumns ).keys() ];
		columnsArray.forEach( ( position ) => {
			DEVICE_BREAKPOINTS.forEach( ( deviceName ) => {
				const defaultSpan = getDefaultSpan(
					deviceName,
					numberOfColumns,
					position
				);
				columnValues[
					getSpanForDevice( position, deviceName )
				] = defaultSpan;

				columnValues[ getOffsetForDevice( position, deviceName ) ] = 0;
			} );
		} );

		setDefaultColumns( false );
		updateColumns( columns, numberOfColumns, columnValues );
	};

	const screenWidth = Math.floor( Dimensions.get( 'window' ).width );
	const selectedColumnsName = columns ? variations[ columns - 1 ].name : null;

	return (
		<>
			{ resizeListener }
			<View style={ styles[ 'grid-columns' ] }>
				<InnerBlocks
					template={ isDefaultColumns ? DEFAULT_TEMPLATE : null }
					templateLock="all"
					allowedBlocks={ ALLOWED_BLOCKS }
					horizontal={ true }
					contentResizeMode="stretch"
					parentWidth={ isFullWidth( align ) ? screenWidth : width }
					blockWidth={ isFullWidth( align ) ? screenWidth : width }
					contentStyle={ {
						width: width ? width : screenWidth,
					} }
				/>
			</View>
			<InspectorControls>
				<PanelBody title={ __( 'Layout', 'layout-grid' ) }>
					<VariationControl.Inner
						variations={ variations }
						onChange={ onChangeLayout }
						selected={ selectedColumnsName }
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
