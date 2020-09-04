/**
 * External dependencies
 */
import { View } from 'react-native';
import { delay, flatMap } from 'lodash';

/**
 * WordPress dependencies
 */
import { 
	InnerBlocks,
	InspectorControls,
	BlockVariationPicker,
 } from '@wordpress/block-editor';
 import {
	PanelBody,
	SelectControl,
	ToggleControl,
	FooterMessageControl,
	Disabled,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import variations from './variations';
import { getGutterValues } from './../constants';


const ALLOWED_BLOCKS = [ 'jetpack/layout-grid-column' ];

const TEMPLATE = [
	[ 'jetpack/layout-grid-column', {}, [] ],
	[ 'jetpack/layout-grid-column', {}, [] ],
];

const Edit = ( props ) => {
	const { clientId, isSelected, setAttributes, attributes = {} } = props;
	const [ isVisible, setIsVisible ] = useState( false );
	const isDefaultColumns = true;

	const { gutterSize, addGutterEnds, verticalAlignment } = attributes;

	useEffect( () => {
		if ( isSelected && isDefaultColumns ) {
			delay( () => setIsVisible( true ), 100 );
		}
	}, [] );

	const toggleControl = (
		<ToggleControl
			label={ __( 'Add end gutters', 'layout-grid' ) }
			help={
				addGutterEnds ? __( 'Toggle off to remove the spacing left and right of the grid.', 'layout-grid' ) : __( 'Toggle on to add space left and right of the layout grid. ', 'layout-grid' )
			}
			checked={ addGutterEnds }
			onChange={ newValue => setAttributes( { addGutterEnds: newValue } )  }
		/>
	);
	
	return (
		<>
			<View>
				<InnerBlocks
					template={ TEMPLATE }
					templateLock="all"
					allowedBlocks={ ALLOWED_BLOCKS }
				/>
			</View>
			<InspectorControls>
				<PanelBody title={ __( 'Layout grid settings' ) }>
				<SelectControl
					label={ __( 'Gutters' ) }
					value={ gutterSize }
					// `undefined` is required for the preload attribute to be unset.
					onChange={  newValue => setAttributes( { gutterSize: newValue, addGutterEnds: newValue === 'none' ? false : addGutterEnds } ) }
					options={ getGutterValues() }
				/>
				{ gutterSize === 'none' ? (
					<Disabled>
						{ toggleControl }
					</Disabled>
				) : toggleControl }
				</PanelBody>
				<PanelBody>
					<FooterMessageControl
						label={ __(
							'Note: Column layout may vary between themes and screen sizes'
						) }
					/>
				</PanelBody>
			</InspectorControls>
			<BlockVariationPicker
				variations={ variations }
				onClose={ () => setIsVisible( false ) }
				clientId={ clientId }
				isVisible={ isVisible }
			/>
		</>
	);
};

export default Edit;
