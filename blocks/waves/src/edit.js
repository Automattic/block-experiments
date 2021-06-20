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
	useSetting,
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

const DEFAULT_COLOR_PALETTE = [ { color: '#000' }, { color: '#FFF' } ];

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
	const inputId = `a8c-waves-height-input-${ instanceId }`;
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
		<BaseControl
			label={ __( 'Minimum height of cover', 'waves' ) }
			id={ inputId }
		>
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
	const { run, parseColor, renderPreview } = window.a8cColorEffects;

	const { toggleSelection } = useDispatch( 'core/block-editor' );
	const [ temporaryMinHeight, setTemporaryMinHeight ] = useState( null );
	const [ isResizing, setIsResizing ] = useState( false );

	const colorPalette = useSetting( 'color.palette' );

	const themeColors = colorPalette?.length
		? colorPalette
		: DEFAULT_COLOR_PALETTE;

	const colors = {
		color1: attributes.color1 || themeColors[ 0 ].color,
		color2: attributes.color2 || themeColors[ 0 ].color,
		color3:
			attributes.color3 || themeColors[ 1 % themeColors.length ].color,
		color4:
			attributes.color4 || themeColors[ 2 % themeColors.length ].color,
	};

	const updatePreview = ( newAttributes = {} ) =>
		renderPreview( {
			complexity: attributes.complexity,
			mouseSpeed: 1,
			fluidSpeed: 1,
			color1: parseColor( colors.color1 ),
			color2: parseColor( colors.color2 ),
			color3: parseColor( colors.color3 ),
			color4: parseColor( colors.color4 ),
			...newAttributes,
		} );

	useEffect( () => {
		// Defaults need to be saved in the attributes because they are dynamic
		// based on theme, and theme settings are not available from save.
		Object.entries( colors ).forEach( ( [ key, value ] ) => {
			if ( attributes[ key ] === undefined ) {
				setAttributes( { [ key ]: value } );
			}
		} );

		// Save the initial preview in the attributes
		if ( attributes.previewImage === undefined ) {
			const previewImage = updatePreview();
			setAttributes( { previewImage } );
		}
	}, [] );

	const minHeightWithUnit = attributes.minHeightUnit
		? `${ attributes.minHeight }${ attributes.minHeightUnit }`
		: attributes.minHeight;
	const style = {
		minHeight: temporaryMinHeight || minHeightWithUnit || undefined,
		backgroundImage: `url( "${ attributes.previewImage }" )`,
	};

	// To avoid recompiling shaders every frame uniform variables need to be
	// mutable so a new reference doesn't have to be passed to run.
	const dataset = useRef( {
		complexity: attributes.complexity,
		mouseSpeed: attributes.mouseSpeed,
		fluidSpeed: attributes.fluidSpeed,
		color1: parseColor( colors.color1 ),
		color2: parseColor( colors.color2 ),
		color3: parseColor( colors.color3 ),
		color4: parseColor( colors.color4 ),
	} );
	useEffect( () => {
		dataset.current.complexity = attributes.complexity;
		dataset.current.mouseSpeed = attributes.mouseSpeed;
		dataset.current.fluidSpeed = attributes.fluidSpeed;
		dataset.current.color1 = parseColor( colors.color1 );
		dataset.current.color2 = parseColor( colors.color2 );
		dataset.current.color3 = parseColor( colors.color3 );
		dataset.current.color4 = parseColor( colors.color4 );
	}, [
		attributes.complexity,
		attributes.mouseSpeed,
		attributes.fluidSpeed,
		colors.color1,
		colors.color2,
		colors.color3,
		colors.color4,
	] );

	const canvasRef = useRef();
	useEffect( () => {
		return run( canvasRef.current, dataset.current );
	}, [ canvasRef.current, dataset.current ] );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Animation', 'waves' ) } initialOpen>
					<RangeControl
						label={ __( 'Complexity', 'waves' ) }
						value={ attributes.complexity }
						onChange={ ( complexity ) => {
							const previewImage = updatePreview( {
								complexity,
							} );
							setAttributes( { complexity, previewImage } );
						} }
						min={ 1 }
						max={ 10 }
					/>
					<RangeControl
						label={ __( 'Mouse Speed', 'waves' ) }
						value={ attributes.mouseSpeed }
						onChange={ ( mouseSpeed ) =>
							setAttributes( { mouseSpeed } )
						}
						min={ 1 }
						max={ 100 }
					/>
					<RangeControl
						label={ __( 'Fluid Speed', 'waves' ) }
						value={ attributes.fluidSpeed }
						onChange={ ( fluidSpeed ) =>
							setAttributes( { fluidSpeed } )
						}
						min={ 1 }
						max={ 100 }
					/>
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Color', 'waves' ) }
					initialOpen
					colorSettings={ [
						{
							label: __( 'Color 1', 'waves' ),
							value: colors.color1,
							onChange: ( color1 = colors.color1 ) => {
								const previewImage = updatePreview( {
									color1: parseColor( color1 ),
								} );
								setAttributes( { color1, previewImage } );
							},
						},
						{
							label: __( 'Color 2', 'waves' ),
							value: colors.color2,
							onChange: ( color2 = colors.color2 ) => {
								const previewImage = updatePreview( {
									color2: parseColor( color2 ),
								} );
								setAttributes( { color2, previewImage } );
							},
						},
						{
							label: __( 'Color 3', 'waves' ),
							value: colors.color3,
							onChange: ( color3 = colors.color3 ) => {
								const previewImage = updatePreview( {
									color3: parseColor( color3 ),
								} );
								setAttributes( { color3, previewImage } );
							},
						},
						{
							label: __( 'Color 4', 'waves' ),
							value: colors.color4,
							onChange: ( color4 = colors.color4 ) => {
								const previewImage = updatePreview( {
									color4: parseColor( color4 ),
								} );
								setAttributes( { color4, previewImage } );
							},
						},
					] }
				/>
				<PanelBody title={ __( 'Dimensions', 'waves' ) }>
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
					<canvas ref={ canvasRef } />
					<div className={ `${ className }__inner-container` }>
						<InnerBlocks
							template={ [
								[
									'core/paragraph',
									{
										align: 'center',
										fontSize: 'large',
										placeholder: __(
											'Write title…',
											'waves'
										),
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
