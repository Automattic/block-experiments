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
	MediaPlaceholder,
	MediaReplaceFlow,
	PanelColorSettings,
	RichText,
	withColors,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
// TODO: Move to components folder
import RadioButtonGroup from '../../../bauhaus-centenary/src/radio-button-group';

/**
 * Internal dependencies
 */
import MotionBackground from './motion-background';

const Edit = ( {
	textColor,
	setTextColor,
	attributes,
	setAttributes,
	className,
} ) => {
	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={ attributes.textAlign }
					onChange={ ( textAlign ) => setAttributes( { textAlign } ) }
				/>
				{ attributes.mode === 'image' && (
					<MediaReplaceFlow
						mediaURL={ attributes.url }
						accept="image/*"
						allowedTypes={ [ 'image' ] }
						onSelect={ ( { url } ) => setAttributes( { url } ) }
						onSelectURL={ ( url ) => setAttributes( { url, id: undefined } ) }
					/>
				) }
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __( 'Paint' ) }
					initialOpen
				>
					<RangeControl
						label={ __( 'Complexity' ) }
						value={ attributes.complexity }
						onChange={ ( complexity ) => setAttributes( { complexity } ) }
						min={ 2 }
						max={ 32 }
					/>
					<RangeControl
						label={ __( 'Mouse Speed' ) }
						value={ attributes.mouseSpeed }
						onChange={ ( mouseSpeed ) => setAttributes( { mouseSpeed } ) }
						min={ 1 }
						max={ 100 }
					/>
					<RangeControl
						label={ __( 'Fluid Speed' ) }
						value={ attributes.fluidSpeed }
						onChange={ ( fluidSpeed ) => setAttributes( { fluidSpeed } ) }
						min={ 1 }
						max={ 100 }
					/>
					<RadioButtonGroup
						data-selected={ attributes.mode }
						options={ [
							{ label: __( 'Gradient' ), value: 'gradient' },
							{ label: __( 'Image' ), value: 'image' },
						] }
						onChange={ ( mode ) => setAttributes( { mode } ) }
						selected={ attributes.mode }
					/>
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Color' ) }
					initialOpen
					colorSettings={ [
						{
							label: __( 'Text Color' ),
							value: textColor.color,
							onChange: setTextColor,
						},
						...( attributes.mode === 'gradient' ? [
							{
								label: __( 'Gradient 1' ),
								value: attributes.color1,
								onChange: ( color1 ) => setAttributes( { color1 } ),
							},
							{
								label: __( 'Gradient 2' ),
								value: attributes.color2,
								onChange: ( color2 ) => setAttributes( { color2 } ),
							},
							{
								label: __( 'Gradient 3' ),
								value: attributes.color3,
								onChange: ( color3 ) => setAttributes( { color3 } ),
							},
							{
								label: __( 'Gradient 4' ),
								value: attributes.color4,
								onChange: ( color4 ) => setAttributes( { color4 } ),
							},
						] : [] ),
					] }
				/>
			</InspectorControls>
			<MotionBackground className={ className } attributes={ attributes }>
				<RichText
					tagName="div"
					className={ classnames(
						'wp-block-a8c-motion-background__heading',
						textColor.class,
						attributes.textAlign && `has-text-align-${ attributes.textAlign }`
					) }
					style={ { color: textColor.color } }
					value={ attributes.heading }
					placeholder={ __( 'Heading' ) }
					onChange={ ( heading ) => setAttributes( { heading } ) }
				/>
				{ attributes.mode === 'image' && ! attributes.url && (
					<MediaPlaceholder
						icon="awards"
						labels={ {
							title: __( 'Motion Background' ),
							instructions: __( 'Upload an image file, or pick one from your media library.' ),
						} }
						accept="image/*"
						allowedTypes={ [ 'image' ] }
						onSelect={ ( { url } ) => setAttributes( { url } ) }
						onSelectURL={ ( url ) => setAttributes( { url, id: undefined } ) }
					/>
				) }
			</MotionBackground>
		</>
	);
};

export default withColors( 'textColor' )( Edit );
