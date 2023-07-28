/**
 * WordPress dependencies
 */
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	useSetting,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	__experimentalGrid as Grid,
	__experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import attributesSettings from './attributes';
import {
	colors as starscapeColors,
	gradients as starscapeGradients,
	htmlElementMessages,
} from './constants';
import Starscape from './starscape';
import { genStars, genAnimations } from './utils';

function StarscapeEdit( { attributes, setAttributes, clientId } ) {
	const {
		// Prevent updates that clear an attribute from resulting in undefined
		// when the property is required. First render grabs blockType defaults,
		// but updates seem to clear it to undefined.
		color = attributesSettings.color.default,
		intensity = attributesSettings.intensity.default,
		density = attributesSettings.density.default,
		speed = attributesSettings.speed.default,
		areaWidth = attributesSettings.areaWidth.default,
		areaHeight = attributesSettings.areaHeight.default,
		tagName: tagName = attributesSettings.tagName.default,
		background,
		minHeight,
		allowedBlocks,
		templateLock,
	} = attributes;

	// Adding the instance id prevents the minHeight input from being removed
	// when the value is deleted and another block is selected and this block
	// is re-selected. ¯\_(ツ)_/¯
	const instanceId = useInstanceId( UnitControl );
	const inputId = `wp-block-a8c-starscape__height-input-${ instanceId }`;

	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	const pxUnits = useCustomUnits( {
		availableUnits: [ 'px' ],
	} );

	const spacingUnits = useSetting( 'spacing.units' );
	const minHeightUnits = useCustomUnits( {
		// Percentages are not supported for minHeight.
		availableUnits: spacingUnits
			? spacingUnits.filter( ( unit ) => unit !== '%' )
			: [ 'px', 'em', 'rem', 'vw', 'vh' ],
		defaultValues: { px: 430, em: 24, rem: 24, vw: 20, vh: 40 },
	} );
	const [ , minHeightUnit ] = parseQuantityAndUnitFromRawValue( minHeight );

	const starStyles = useMemo(
		() => genStars( { color, density, areaWidth, areaHeight } ),
		[ color, density, areaWidth, areaHeight ]
	);

	const animationStyles = useMemo( () => genAnimations( { speed } ), [
		speed,
	] );

	const blockProps = useBlockProps( {
		className: 'wp-block-a8c-starscape',
		style: { background, minHeight },
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'wp-block-a8c-starscape__inner',
		},
		{
			allowedBlocks,
			templateLock,
			template: [
				[
					'core/heading',
					{
						textAlign: 'center',
						placeholder: __( 'Write title…', 'starscape' ),
					},
				],
			],
		}
	);

	const colors = useMemo(
		() => [ starscapeColors, ...colorGradientSettings.colors ],
		[ colorGradientSettings.colors ]
	);

	const gradients = useMemo(
		() => [ starscapeGradients, ...colorGradientSettings.gradients ],
		[ colorGradientSettings.gradients ]
	);

	return (
		<>
			<InspectorControls group="settings">
				<PanelBody title={ __( 'Stars', 'starscape' ) }>
					<RangeControl
						label={ __( 'Density', 'starscape' ) }
						value={ density }
						onChange={ ( nextDensity ) =>
							setAttributes( { density: nextDensity } )
						}
						min={ 1 }
						max={ 100 }
					/>
					<RangeControl
						label={ __( 'Speed', 'starscape' ) }
						value={ speed }
						onChange={ ( nextSpeed ) =>
							setAttributes( { speed: nextSpeed } )
						}
						min={ 1 }
						max={ 100 }
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					{ ...colorGradientSettings }
					settings={ [
						{
							label: __( 'Stars', 'starscape' ),
							isShownByDefault: true,
							colorValue: color,
							onColorChange: ( nextColor ) => {
								setAttributes( { color: nextColor } );
							},
							resetAllFilter: () => ( { color: undefined } ),
						},
						{
							label: __( 'Background', 'starscape' ),
							isShownByDefault: true,
							colorValue: background,
							gradientValue: background,
							onColorChange: ( nextBackground ) => {
								if ( nextBackground )
									setAttributes( {
										background: nextBackground,
									} );
							},
							onGradientChange: ( nextBackground ) => {
								if ( nextBackground )
									setAttributes( {
										background: nextBackground,
									} );
							},
							resetAllFilter: () => ( { background: undefined } ),
						},
					] }
					colors={ colors }
					gradients={ gradients }
					panelId={ clientId }
					__experimentalIsRenderedInSidebar
				/>
				<ToolsPanelItem
					label={ __( 'Star intensity', 'starscape' ) }
					hasValue={ () =>
						intensity !== attributesSettings.intensity.default
					}
					onDeselect={ () => {
						setAttributes( { intensity: undefined } );
					} }
					resetAllFilter={ () => ( { intensity: undefined } ) }
					panelId={ clientId }
					isShownByDefault
				>
					<RangeControl
						label={ __( 'Star intensity', 'starscape' ) }
						value={ intensity }
						onChange={ ( nextIntensity ) =>
							setAttributes( {
								intensity: nextIntensity,
							} )
						}
						min={ 0 }
						max={ 100 }
						step={ 10 }
						__nextHasNoMarginBottom
					/>
				</ToolsPanelItem>
			</InspectorControls>
			<InspectorControls group="dimensions">
				<ToolsPanelItem
					label={ __( 'Minimum block height', 'starscape' ) }
					hasValue={ () => !! minHeight }
					onDeselect={ () =>
						setAttributes( { minHeight: undefined } )
					}
					resetAllFilter={ () => ( { minHeight: undefined } ) }
					panelId={ clientId }
					isShownByDefault
				>
					<UnitControl
						label={ __( 'Minimum block height', 'starscape' ) }
						labelPosition="top"
						value={ minHeight }
						onChange={ ( nextMinHeight ) => {
							setAttributes( {
								// Convert '' to undefined.
								minHeight: nextMinHeight || undefined,
							} );
						} }
						min={ minHeightUnit === 'px' ? 50 : 0 }
						units={ minHeightUnits }
						isResetValueOnUnitChange
						id={ inputId }
						size={ '__unstable-large' }
						__nextHasNoMarginBottom
					/>
				</ToolsPanelItem>
			</InspectorControls>
			<InspectorControls group="advanced">
				<Grid
					className="wp-block-a8c-starscape__advanced"
					columns={ 2 }
				>
					<p>
						{ __(
							'Control the area of stars you want. Smaller values have better performance, but blocks larger than the area specified will not be completely covered.',
							'starscape'
						) }
					</p>
					<UnitControl
						label={ __( 'Area width', 'starscape' ) }
						labelPosition="top"
						value={ areaWidth }
						onChange={ ( nextAreaWidth ) => {
							setAttributes( {
								// Discard 'px' units and convert '' to undefined.
								areaWidth: nextAreaWidth
									? parseInt( nextAreaWidth, 10 )
									: undefined,
							} );
						} }
						min={ 1 }
						units={ pxUnits }
						size={ '__unstable-large' }
						__nextHasNoMarginBottom
					/>
					<UnitControl
						label={ __( 'Area height', 'starscape' ) }
						labelPosition="top"
						units={ pxUnits }
						min={ 1 }
						value={ areaHeight }
						onChange={ ( nextAreaHeight ) => {
							setAttributes( {
								// Discard 'px' units and convert '' to undefined.
								areaHeight: nextAreaHeight
									? parseInt( nextAreaHeight, 10 )
									: undefined,
							} );
						} }
						size={ '__unstable-large' }
						__nextHasNoMarginBottom
					/>
				</Grid>
				<SelectControl
					label={ __( 'HTML element', 'starscape' ) }
					help={ htmlElementMessages[ tagName ] }
					value={ tagName }
					onChange={ ( nextTagName ) =>
						setAttributes( { tagName: nextTagName } )
					}
					options={ [
						{
							label: __( 'Default (<div>)', 'starscape' ),
							value: 'div',
						},
						{ label: '<header>', value: 'header' },
						{ label: '<main>', value: 'main' },
						{ label: '<section>', value: 'section' },
						{ label: '<article>', value: 'article' },
						{ label: '<aside>', value: 'aside' },
						{ label: '<footer>', value: 'footer' },
					] }
					__nextHasNoMarginBottom
				/>
			</InspectorControls>
			<Starscape
				as={ tagName }
				starStyles={ starStyles }
				animationStyles={ animationStyles }
				intensity={ intensity }
				{ ...blockProps }
			>
				<div { ...innerBlocksProps } />
			</Starscape>
		</>
	);
}

export default StarscapeEdit;
