/**
 * WordPress dependencies
 */
import { InspectorControls, RichText } from '@wordpress/block-editor';
import { SelectControl, Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import UploadPlaceholder from './upload-placeholder';

/* global juxtapose */

const edit = ( { attributes, isSelected, setAttributes } ) => {
	const { imageBefore, imageAfter, caption, orientation } = attributes;

	// If both images are set, add juxtaspose class, which is picked up by the library.
	const classes = ( imageBefore && imageAfter ) ? 'image-compare__compare juxtapose' : 'image-compare__placeholder';

	return (
		<>
			<InspectorControls key="controls">
				<h4> { __( 'Orientation' ) } </h4>
				<SelectControl
					value={ orientation }
					options={ [
						{ label: __( 'Side by Side' ), value: 'horizontal' },
						{ label: __( 'Above and Below' ), value: 'vertical' },
					] }
					onChange={ ( val ) => {
						setAttributes( { orientation: val } );
						// need slight delay so markup can be updated before
						// scan page gets triggered
						setTimeout( function() {
							juxtapose.scanPage();
						}, 100 );
					} }
				/>
			</InspectorControls>
			<div className={ classes } data-mode={ orientation }>

				<Placeholder>
					{ imageBefore ? (
						<img alt={ __( 'Comparison image 1' ) } src={ imageBefore } />
					) : (
						<div className="image-compare__image-before">
							<div className="components-placeholder__label">{ __( 'Image 1' ) }</div>
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
						</div>
					) }

					{ imageAfter ? (
						<img alt={ __( 'Comparison image 2' ) }  src={ imageAfter } />
					) : (
						<div className="image-compare__image-after">
							<div className="components-placeholder__label">{ __( 'Image 2' ) }</div>
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
						</div>
					) }
				</Placeholder>
			</div>
			{ ( ! RichText.isEmpty( caption ) || isSelected ) && (
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
