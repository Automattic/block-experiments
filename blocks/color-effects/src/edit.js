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
import { useDispatch } from '@wordpress/data';
import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import defaultColors from './default-colors';

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
	const color1OrDefault = attributes.color1 || defaultColors.color1;
	const color2OrDefault = attributes.color2 || defaultColors.color2;
	const color3OrDefault = attributes.color3 || defaultColors.color3;
	const color4OrDefault = attributes.color4 || defaultColors.color4;
	const { toggleSelection } = useDispatch( 'core/block-editor' );
	const [ temporaryMinHeight, setTemporaryMinHeight ] = useState( null );
	const [ isResizing, setIsResizing ] = useState( false );
	const minHeightWithUnit = attributes.minHeightUnit
		? `${ attributes.minHeight }${ attributes.minHeightUnit }`
		: attributes.minHeight;
	const style = {
		minHeight: temporaryMinHeight || minHeightWithUnit || undefined,
		backgroundBlendMode: 'screen',
		background: `linear-gradient( 45deg, ${ color1OrDefault }, rgba( 0, 0, 0, 0 ) 81.11% ),
linear-gradient( 135deg, ${ color2OrDefault }, rgba( 0, 0, 0, 0 ) 81.11% ),
linear-gradient( 225deg, ${ color3OrDefault }, rgba( 0, 0, 0, 0 ) 81.11% ),
linear-gradient( 315deg, ${ color4OrDefault }, rgba( 0, 0, 0, 0 ) 81.11% ),
#000`,
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
							label: __( 'Gradient 1' ),
							value: color1OrDefault,
							onChange: ( color1 ) => setAttributes( { color1 } ),
						},
						{
							label: __( 'Gradient 2' ),
							value: color2OrDefault,
							onChange: ( color2 ) => setAttributes( { color2 } ),
						},
						{
							label: __( 'Gradient 3' ),
							value: color3OrDefault,
							onChange: ( color3 ) => setAttributes( { color3 } ),
						},
						{
							label: __( 'Gradient 4' ),
							value: color4OrDefault,
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
						data-color1={ color1OrDefault }
						data-color2={ color2OrDefault }
						data-color3={ color3OrDefault }
						data-color4={ color4OrDefault }
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
