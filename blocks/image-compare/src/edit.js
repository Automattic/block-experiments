/**
 * WordPress dependencies
 */
import { InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, RadioControl, Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import UploadPlaceholder from './upload-placeholder';

/* global juxtapose */

const edit = ( { attributes, isSelected, setAttributes } ) => {
	const { imageBefore, imageAfter, caption, orientation } = attributes;

	const RadioControlWithState = ( props ) => {
		const [ option ] = useState( 'horizontal' );

		return (
			<RadioControl { ...props }
				selected={ option }
				onChange={ ( value ) => {
					setAttributes( {
						orientation: value,
					} )

					// Set a delay so markup can be updated before scan page gets triggered.
					setTimeout( function() {
						juxtapose.scanPage();
					}, 100 );
				} }
			/>
		);
	};

	// If both images are set, add juxtaspose class, which is picked up by the library.
	const classes = ( imageBefore && imageAfter ) ? 'image-compare__comparison juxtapose' : 'image-compare__placeholder';

	return (
		<>
			<InspectorControls key="controls">
				<PanelBody title={ __( 'Orientation' ) }>
					<RadioControlWithState
						selected={ orientation }
						options={ [
							{ label: __( 'Side by side' ), value: 'horizontal' },
							{ label: __( 'Above and below' ), value: 'vertical' },
						] }
					/>
				</PanelBody>
			</InspectorControls>
			<div className={ classes } data-mode={ orientation }>

				<Placeholder>
					<div className="image-compare__image-before">
						{ imageBefore ? (
							<img alt={ __( 'Comparison image 1' ) } src={ imageBefore } />
						) : (
							<>
								<div className="components-placeholder__label">{ __( 'Image Before' ) }</div>
								<UploadPlaceholder
									onSelect={
										( el ) => {
											setAttributes( { imageBefore: el.url } );
											juxtapose.scanPage();
										}
									}
									allowedTypes={ [ 'image' ] }
									labels={ { title: __( 'First image to compare' ) } }
								/>
							</>
						) }
					</div>

					<div className="image-compare__image-after">
						{ imageAfter ? (
							<img alt={ __( 'Comparison image 2' ) }  src={ imageAfter } />
						) : (
							<>
								<div className="components-placeholder__label">{ __( 'Image After' ) }</div>
								<UploadPlaceholder
									onSelect={
										( el ) => {
											setAttributes( { imageAfter: el.url } );
											juxtapose.scanPage();
										}
									}
									allowedTypes={ [ 'image' ] }
									labels={ { title: __( 'Second image to compare' ) } }
								/>
							</>
						) }
					</div>
				</Placeholder>
			</div>
			{ ( ! RichText.isEmpty( caption ) || isSelected && imageBefore && imageAfter ) && (
				<RichText
					tagName="figcaption"
					placeholder={ __( 'Write caption' ) }
					value={ caption }
					onChange={ ( value ) =>
						setAttributes( { caption: value } )
					}
					// these are from image caption, do we need?
					//unstableOnFocus={ this.onFocusCaption }
					//isSelected={ this.state.captionFocused }
					inlineToolbar
				/>
			) }
		</>
	);
};

export default edit;
