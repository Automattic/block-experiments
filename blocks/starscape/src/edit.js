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
	__experimentalUseEditorFeature as useEditorFeature,
} from '@wordpress/block-editor';
import { BaseControl, PanelBody, RangeControl } from '@wordpress/components';
import { compose, withInstanceId } from '@wordpress/compose';
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
	const themeColors = useEditorFeature( 'color.palette' ) || [];

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={ attributes.textAlign }
					onChange={ ( textAlign ) => setAttributes( { textAlign } ) }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __( 'Stars', 'starscape' ) }
					initialOpen={ false }
				>
					<RangeControl
						label={ __( 'Density', 'starscape' ) }
						value={ attributes.density }
						onChange={ ( density ) =>
							setAttributes( {
								density,
								starStyles: genStars( {
									...attributes,
									density,
								} ),
							} )
						}
						min={ 1 }
						max={ 100 }
					/>
					<RangeControl
						label={ __( 'Speed', 'starscape' ) }
						value={ attributes.speed }
						onChange={ ( speed ) =>
							setAttributes( {
								speed,
								animationStyles: genAnimations( { speed } ),
							} )
						}
						min={ 1 }
						max={ 100 }
					/>
				</PanelBody>
				<PanelColorGradientSettings
					title={ __( 'Color', 'starscape' ) }
					colors={ [
						...themeColors,
						...colorGradientOptions.colors,
					] }
					gradients={ colorGradientOptions.gradients }
					settings={ [
						{
							label: __( 'Background', 'starscape' ),
							gradientValue: attributes.background,
							onGradientChange: ( background ) =>
								setAttributes( { background } ),
						},
						{
							label: __( 'Text', 'starscape' ),
							colorValue: textColor.color,
							onColorChange: setTextColor,
						},
					] }
				/>
				<PanelBody
					title={ __( 'Dimensions', 'starscape' ) }
					initialOpen={ false }
				>
					<p>
						{ __(
							'Control the area of stars you want. Smaller values have better performance, but blocks larger than the area specified will not be completely covered.',
							'starscape'
						) }
					</p>
					<BaseControl
						className="wp-block-a8c-starscape-resolution-control"
						id={ `wp-block-a8c-starscape-width-control-${ instanceId }` }
						label={ __( 'Max Width', 'starscape' ) }
					>
						<input
							id={ `wp-block-a8c-starscape-width-control-${ instanceId }` }
							type="number"
							min="0"
							value={ attributes.maxWidth }
							onChange={ ( ev ) => {
								const maxWidth = parseInt(
									ev.target.value,
									10
								);
								setAttributes( {
									maxWidth,
									starStyles: genStars( {
										...attributes,
										maxWidth,
									} ),
								} );
							} }
						/>
					</BaseControl>
					<BaseControl
						className="wp-block-a8c-starscape-resolution-control"
						id={ `wp-block-a8c-starscape-height-control-${ instanceId }` }
						label={ __( 'Max Height', 'starscape' ) }
					>
						<input
							id={ `wp-block-a8c-starscape-height-control-${ instanceId }` }
							type="number"
							min="0"
							value={ attributes.maxHeight }
							onChange={ ( ev ) => {
								const maxHeight = parseInt(
									ev.target.value,
									10
								);
								setAttributes( {
									maxHeight,
									starStyles: genStars( {
										...attributes,
										maxHeight,
									} ),
								} );
							} }
						/>
					</BaseControl>
				</PanelBody>
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
						attributes.textAlign &&
							`has-text-align-${ attributes.textAlign }`
					) }
					style={ { color: textColor.color } }
					value={ attributes.heading }
					placeholder={ __( 'Heading', 'starscape' ) }
					onChange={ ( heading ) => setAttributes( { heading } ) }
				/>
			</Starscape>
		</>
	);
};

export default compose( [ withInstanceId, withColors( 'textColor' ) ] )( Edit );
