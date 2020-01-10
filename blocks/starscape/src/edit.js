/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	AlignmentToolbar,
	BlockControls,
	InspectorControls,
	RichText,
	withColors,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
} from '@wordpress/block-editor';
import {
	BaseControl,
	PanelBody,
	RangeControl,
} from '@wordpress/components';
import { compose, withInstanceId } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { genStars, genAnimations } from './utils';
import colorGradientOptions from './colorGradientOptions';
import Starscape from './starscape';

const Edit = ( {
	instanceId,
	textColor,
	setTextColor,
	attributes,
	setAttributes,
	className,
} ) => {
	const themeColors = useSelect(
		( select ) => select( 'core/block-editor' ).getSettings().colors
	);
	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={ attributes.textAlign }
					onChange={ ( textAlign ) => setAttributes( { textAlign } ) }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Stars' ) } initialOpen={ false }>

					<RangeControl
						label={ __( 'Density' ) }
						value={ attributes.density }
						onChange={ ( density ) => setAttributes( {
							density,
							starStyles: genStars( { ...attributes, density } ),
						} ) }
						min={ 1 }
						max={ 100 }
					/>
					<RangeControl
						label={ __( 'Speed' ) }
						value={ attributes.speed }
						onChange={ ( speed ) => setAttributes( {
							speed,
							animationStyles: genAnimations( { speed } ),
						} ) }
						min={ 1 }
						max={ 100 }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Dimensions' ) } initialOpen={ false }>
					<p>{ __( 'The maximum dimensions control how far out to render stars. It does not change the size of the container. Keep these values as small as possible, especially with higher density stars, for better performance on low-powered devices.' ) }</p>
					<BaseControl
						className="wp-block-a8c-starscape-resolution-control"
						id={ `wp-block-a8c-starscape-width-control-${ instanceId }` }
						label={ __( 'Max Width' ) }
					>
						<input
							id={ `wp-block-a8c-starscape-width-control-${ instanceId }` }
							type="number"
							min="0"
							value={ attributes.maxWidth }
							onChange={ ( ev ) => {
								const maxWidth = parseInt( ev.target.value, 10 );
								setAttributes( {
									maxWidth,
									starStyles: genStars( { ...attributes, maxWidth } ),
								} );
							} }
						/>
					</BaseControl>
					<BaseControl
						className="wp-block-a8c-starscape-resolution-control"
						id={ `wp-block-a8c-starscape-height-control-${ instanceId }` }
						label={ __( 'Max Height' ) }
					>
						<input
							id={ `wp-block-a8c-starscape-height-control-${ instanceId }` }
							type="number"
							min="0"
							value={ attributes.maxHeight }
							onChange={ ( ev ) => {
								const maxHeight = parseInt( ev.target.value, 10 );
								setAttributes( {
									maxHeight,
									starStyles: genStars( { ...attributes, maxHeight } ),
								} );
							} }
						/>
					</BaseControl>
				</PanelBody>
				<PanelColorGradientSettings
					title={ __( 'Color' ) }
					colors={ [ ...themeColors, ...colorGradientOptions.colors ] }
					gradients={ colorGradientOptions.gradients }
					settings={ [
						{
							label: __( 'Background' ),
							gradientValue: attributes.background,
							onGradientChange: ( background ) => setAttributes( { background } ),
						},
						{
							label: __( 'Text' ),
							colorValue: textColor.color,
							onColorChange: setTextColor,
						},
					] }
				/>
			</InspectorControls>
			<Starscape
				className={ className }
				starStyles={ attributes.starStyles }
				animationStyles={ attributes.animationStyles }
				background={ attributes.background }
			>
				<RichText
					tagName="div"
					className={ classnames(
						'wp-block-a8c-starscape__heading',
						textColor.class,
						attributes.textAlign && `has-text-align-${ attributes.textAlign }`
					) }
					style={ { color: textColor.color } }
					value={ attributes.heading }
					placeholder={ __( 'Heading' ) }
					onChange={ ( heading ) => setAttributes( { heading } ) }
				/>
			</Starscape>
		</>
	);
};

export default compose( [
	withInstanceId,
	withColors( 'textColor' ),
] )( Edit );
