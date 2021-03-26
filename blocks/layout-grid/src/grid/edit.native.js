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
	ToggleControl,
	FooterMessageControl,
	Disabled,
	BottomSheetSelectControl,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	createBlocksFromInnerBlocksTemplate,
	store as blockEditorStore,
} from '@wordpress/blocks';
import { useDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
/**
 * Internal dependencies
 */
import variations from './variations';
import { getGutterValues } from './../constants';
import styles from './edit.scss';
import BottomSheetVariationControl from './bottom-sheet-variation-control';
import BottomSheetResponsiveBreakpointsControl from './bottom-sheet-responsive-breakpoints-control';

const ALLOWED_BLOCKS = [ 'jetpack/layout-grid-column' ];

const TEMPLATE = [
	[ 'jetpack/layout-grid-column', {}, [] ],
	[ 'jetpack/layout-grid-column', {}, [] ],
];

const Edit = ( props ) => {
	
	const { clientId, isSelected, setAttributes, attributes = {} } = props;
	const [ isVisible, setIsVisible ] = useState( false );
	const isDefaultColumns = true;

	const { gutterSize, addGutterEnds } = attributes;

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
				<PanelBody title={ __( 'Layouts' ) }>
					<BottomSheetVariationControl
						label={ __( 'Columns' ) }
						value={ 'three-columns' } /* Supply the correct Value */
						// `undefined` is required for the preload attribute to be unset.
						onChange={ ( newValue ) => {
								// @Todo change the number of columns
								console.log( 'howdy', newValue );
							}
							
						}
						options={ variations }
					/>
					<BottomSheetResponsiveBreakpointsControl
						label={ __( 'Responsive Breakpoints' ) }
						value={ 'Edit' } /* Supply the correct Value */
						// `undefined` is required for the preload attribute to be unset.
						onChange={ ( newValue ) => {
								// @Todo change the number of columns
								console.log( 'howdy', newValue );
							}
						}
						options={ variations }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Layout grid settings' ) }>
					<BottomSheetSelectControl
						label={ __( 'Gutters' ) }
						value={ gutterSize }
						// `undefined` is required for the preload attribute to be unset.
						onChange={ ( newValue ) =>
							setAttributes( {
								gutterSize: newValue,
								addGutterEnds:
									newValue === 'none' ? false : addGutterEnds,
							} )
						}
						options={ getGutterValues() }
					/>
					{ gutterSize === 'none' ? (
						<Disabled>{ toggleControl }</Disabled>
					) : (
						toggleControl
					) }
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