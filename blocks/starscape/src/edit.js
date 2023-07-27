/**
 * WordPress dependencies
 */
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	__experimentalGrid as Grid,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';
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
		// TODO: Not sure why the default attributes from the block type aren't
		// used here when the panel is reset, but it breaks the panel if we
		// don't set these.
		color = attributesSettings.color.default,
		background = attributesSettings.background.default,
		intensity = attributesSettings.intensity.default,
		density = attributesSettings.density.default,
		speed = attributesSettings.speed.default,
		areaWidth = attributesSettings.areaWidth.default,
		areaHeight = attributesSettings.areaHeight.default,
		tagName: tagName = attributesSettings.tagName.default,
		allowedBlocks,
		templateLock,
	} = attributes;

	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	const pxUnits = useCustomUnits( {
		availableUnits: [ 'px' ],
	} );

	const starStyles = useMemo(
		() => genStars( { color, density, areaWidth, areaHeight } ),
		[ color, density, areaWidth, areaHeight ]
	);

	const animationStyles = useMemo( () => genAnimations( { speed } ), [
		speed,
	] );

	const blockProps = useBlockProps( {
		className: 'wp-block-a8c-starscape',
		style: { background },
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
