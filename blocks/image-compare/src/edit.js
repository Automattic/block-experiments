/**
 * WordPress dependencies
 */
import { InspectorControls, RichText } from '@wordpress/block-editor';
import { MediaPlaceholder } from '@wordpress/editor';
import { SelectControl, TextControl, Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const edit = ( { attributes, className, isSelected, setAttributes } ) => {
	const { imageBefore, imageAfter, caption, orientation } = attributes;

	// if both are defined, add juxtaspose class
	// the juxtapose library uses class when page is scanned
	// to find the images and apply the side-by-side magic
	const cls = ( imageBefore && imageAfter ) ? 'juxtapose' : 'controls';

	return (
		<>
			<InspectorControls key="controls">
				<h4> Orientation </h4>
				<SelectControl
					value={ orientation }
					options={ [
						{ label: 'Side by Side', value: 'horizontal' },
						{ label: 'Above and Below', value: 'vertical' },
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
			<div className={ cls } data-mode={ orientation }>

				<Placeholder>
					{ imageBefore ? (
						<img src={ imageBefore } />
					) : (
						<div className="img-edit-before">
							<MediaPlaceholder
								onSelect ={
									( el ) => {
										setAttributes( { imageBefore: el.url } );
										juxtapose.scanPage();
									}
								}
								allowedTypes={ [ 'image' ] }
								labels={ { title: 'Image Before' } }
							/>
						</div>
					) }

					{ imageAfter ? (
						<img src={ imageAfter } />
					) : (
						<div className="img-edit-after">
							<MediaPlaceholder
								onSelect={
									( el ) => {
										setAttributes( { imageAfter: el.url } );
										juxtapose.scanPage();
									}
								}
								allowedTypes={ [ 'image' ] }
								labels={ { title: 'Image After' } }
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
