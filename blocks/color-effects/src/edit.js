/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	InspectorControls,
	PanelColorSettings,
	InnerBlocks,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	ResizableBox,
	BaseControl,
} from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getFallbackStyle } from './shared';

const DEFAULT_COLORS = {
	color1: '#000',
	color2: '#555',
	color3: '#AAA',
	color4: '#FFF',
};

const MIN_HEIGHT = 50;

const CSS_UNITS = [
	{ value: 'px', label: 'px', default: 430 },
	{ value: 'em', label: 'em', default: 20 },
	{ value: 'rem', label: 'rem', default: 20 },
	{ value: 'vw', label: 'vw', default: 20 },
	{ value: 'vh', label: 'vh', default: 50 },
];

const RESIZABLE_BOX_ENABLE_OPTION = {
	top: false,
	right: false,
	bottom: true,
	left: false,
	topRight: false,
	bottomRight: false,
	bottomLeft: false,
	topLeft: false,
};

function HeightInput( { onChange, onUnitChange, unit = 'px', value = '' } ) {
	const [ temporaryInput, setTemporaryInput ] = useState( null );
	const instanceId = useInstanceId( UnitControl );
	const inputId = `a8c-color-effects-height-input-${ instanceId }`;
	const isPx = unit === 'px';

	const handleOnChange = ( unprocessedValue ) => {
		const inputValue =
			unprocessedValue !== ''
				? parseInt( unprocessedValue, 10 )
				: undefined;

		if ( isNaN( inputValue ) && inputValue !== undefined ) {
			setTemporaryInput( unprocessedValue );
			return;
		}
		setTemporaryInput( null );
		onChange( inputValue );
	};

	const handleOnBlur = () => {
		if ( temporaryInput !== null ) {
			setTemporaryInput( null );
		}
	};

	const inputValue = temporaryInput !== null ? temporaryInput : value;
	const min = isPx ? MIN_HEIGHT : 0;

	return (
		<BaseControl label={ __( 'Minimum height of cover' ) } id={ inputId }>
			<UnitControl
				id={ inputId }
				min={ min }
				onBlur={ handleOnBlur }
				onChange={ handleOnChange }
				onUnitChange={ onUnitChange }
				step="1"
				style={ { maxWidth: 80 } }
				unit={ unit }
				units={ CSS_UNITS }
				value={ inputValue }
			/>
		</BaseControl>
	);
}

function Edit( { attributes, className, isSelected, setAttributes } ) {
	const { toggleSelection } = useDispatch( 'core/block-editor' );
	const [ temporaryMinHeight, setTemporaryMinHeight ] = useState( null );
	const [ isResizing, setIsResizing ] = useState( false );

	const themeColors = useSelect(
		( select ) => select( 'core/block-editor' ).getSettings().colors,
		[]
	);
	const colors = {
		color1:
			attributes.color1 ||
			themeColors[ 0 ].color ||
			DEFAULT_COLORS.color1,
		color2:
			attributes.color2 ||
			themeColors[ 1 % themeColors.length ].color ||
			DEFAULT_COLORS.color2,
		color3:
			attributes.color3 ||
			themeColors[ 2 % themeColors.length ].color ||
			DEFAULT_COLORS.color3,
		color4:
			attributes.color4 ||
			themeColors[ 3 % themeColors.length ].color ||
			DEFAULT_COLORS.color4,
	};

	useEffect( () => {
		// Defaults need to be saved in the attributes because they are dynamic
		// based on theme, and theme settings are not available from save.
		Object.entries( colors ).forEach( ( [ key, value ] ) => {
			if ( attributes[ key ] === undefined ) {
				setAttributes( { [ key ]: value } );
			}
		} );
	}, [] );

	const minHeightWithUnit = attributes.minHeightUnit
		? `${ attributes.minHeight }${ attributes.minHeightUnit }`
		: attributes.minHeight;
	const style = {
		minHeight: temporaryMinHeight || minHeightWithUnit || undefined,
		...getFallbackStyle( colors ),
	};

	const canvasRef = useRef();
	useEffect( () => {
		return window.a8cColorEffects.run( canvasRef.current );
	}, [ canvasRef.current ] );
	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Animation' ) } initialOpen>
					<RangeControl
						label={ __( 'Complexity' ) }
						value={ attributes.complexity }
						onChange={ ( complexity ) =>
							setAttributes( { complexity } )
						}
						min={ 2 }
						max={ 32 }
					/>
					<RangeControl
						label={ __( 'Mouse Speed' ) }
						value={ attributes.mouseSpeed }
						onChange={ ( mouseSpeed ) =>
							setAttributes( { mouseSpeed } )
						}
						min={ 1 }
						max={ 100 }
					/>
					<RangeControl
						label={ __( 'Fluid Speed' ) }
						value={ attributes.fluidSpeed }
						onChange={ ( fluidSpeed ) =>
							setAttributes( { fluidSpeed } )
						}
						min={ 1 }
						max={ 100 }
					/>
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Color' ) }
					initialOpen
					colorSettings={ [
						{
							label: __( 'Color 1' ),
							value: colors.color1,
							onChange: ( color1 ) => setAttributes( { color1 } ),
						},
						{
							label: __( 'Color 2' ),
							value: colors.color2,
							onChange: ( color2 ) => setAttributes( { color2 } ),
						},
						{
							label: __( 'Color 3' ),
							value: colors.color3,
							onChange: ( color3 ) => setAttributes( { color3 } ),
						},
						{
							label: __( 'Color 4' ),
							value: colors.color4,
							onChange: ( color4 ) => setAttributes( { color4 } ),
						},
					] }
				/>
				<PanelBody title={ __( 'Dimensions' ) }>
					<HeightInput
						value={ temporaryMinHeight || attributes.minHeight }
						unit={ attributes.minHeightUnit }
						onChange={ ( minHeight ) =>
							setAttributes( { minHeight } )
						}
						onUnitChange={ ( minHeightUnit ) =>
							setAttributes( { minHeightUnit } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<ResizableBox
				className={ classnames( `${ className }__resize-container`, {
					'is-resizing': isResizing,
				} ) }
				enable={ RESIZABLE_BOX_ENABLE_OPTION }
				onResizeStart={ ( event, direction, elt ) => {
					toggleSelection( false );
					setAttributes( { minHeightUnit: 'px' } );
					setTemporaryMinHeight( elt.clientHeight );
				} }
				onResize={ ( event, direction, elt ) => {
					// Setting is-resizing here instead of onResizeStart fixes
					// an issue with the positioning of the resize bar when
					// starting a resize after having resized smaller than the
					// auto height
					setIsResizing( true );
					setTemporaryMinHeight( elt.clientHeight );
				} }
				onResizeStop={ ( event, direction, elt ) => {
					toggleSelection( true );
					setIsResizing( false );
					setAttributes( { minHeight: elt.clientHeight } );
					setTemporaryMinHeight( null );
				} }
				minHeight={ MIN_HEIGHT }
				showHandle={ isSelected }
			>
				<div className={ className } style={ style }>
					<canvas
						ref={ canvasRef }
						data-complexity={ attributes.complexity }
						data-mouse-speed={ attributes.mouseSpeed }
						data-fluid-speed={ attributes.fluidSpeed }
						data-color1={ colors.color1 }
						data-color2={ colors.color2 }
						data-color3={ colors.color3 }
						data-color4={ colors.color4 }
					/>
					<div className={ `${ className }__inner-container` }>
						<InnerBlocks
							template={ [
								[
									'core/paragraph',
									{
										align: 'center',
										fontSize: 'large',
										placeholder: __( 'Write title…' ),
									},
								],
							] }
						/>
					</div>
				</div>
			</ResizableBox>
		</>
	);
}

export default Edit;
