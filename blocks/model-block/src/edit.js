import '@google/model-viewer';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Disabled,
	ExternalLink,
	PanelBody,
	TextControl,
	TextareaControl,
	ToggleControl,
	withNotices,
} from '@wordpress/components';
import { useReducedMotion } from '@wordpress/compose';
import {
	BlockControls,
	BlockIcon,
	InspectorControls,
	MediaPlaceholder,
	MediaReplaceFlow,
	useBlockProps,
} from '@wordpress/block-editor';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { file as icon } from '@wordpress/icons';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export function Edit( { attributes, setAttributes, isSelected, noticeUI } ) {
	const { id, src, alt, width, height, autoRotate } = attributes;

	function onSelectModel( media ) {
		if ( ! media || ! media.url ) {
			setAttributes( {
				id: undefined,
				src: undefined,
				width: undefined,
				height: undefined,
			} );
			return;
		}

		setAttributes( {
			src: media.url,
			id: media.id,
		} );
	}

	function onSelectURL( newSrc ) {
		if ( newSrc !== src ) {
			setAttributes( { src: newSrc, id: undefined } );
		}
	}

	function onUploadError( message ) {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( message );
	}

	function updateAlt( newAlt ) {
		setAttributes( { alt: newAlt } );
	}

	function updateDimension( dimension, value ) {
		setAttributes( { [ dimension ]: value } );
	}

	function toggleAutoRotate( newAutoRotate ) {
		setAttributes( { autoRotate: newAutoRotate } );
	}

	const isReducedMotion = useReducedMotion();

	const blockProps = useBlockProps();

	if ( ! src ) {
		return (
			<div { ...blockProps }>
				<MediaPlaceholder
					icon={ <BlockIcon icon={ icon } /> }
					onSelect={ onSelectModel }
					onSelectURL={ onSelectURL }
					accept="application/octet-stream"
					allowedTypes="model"
					value={ attributes }
					notices={ noticeUI }
					onError={ onUploadError }
				/>
			</div>
		);
	}

	// React stringifies custom properties, so use object destructuring to disable auto-rotate.
	// See https://github.com/facebook/react/issues/9230
	const autoRotateAttr =
		autoRotate && ! isReducedMotion ? { 'auto-rotate': true } : {};

	return (
		<>
			<BlockControls group="other">
				<MediaReplaceFlow
					mediaId={ id }
					mediaURL={ src }
					allowedTypes="model"
					accept={ [ 'application/octet-stream' ] }
					onSelect={ onSelectModel }
					onSelectURL={ onSelectURL }
					onError={ onUploadError }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) }>
					<div className="block-editor-image-size-control">
						<div className="block-editor-image-size-control__row">
							<TextControl
								type="number"
								className="block-editor-image-size-control__width"
								label={ __( 'Width' ) }
								value={ width }
								min={ 1 }
								onChange={ ( value ) =>
									updateDimension( 'width', value )
								}
							/>
							<TextControl
								type="number"
								className="block-editor-image-size-control__height"
								label={ __( 'Height' ) }
								value={ height }
								min={ 1 }
								onChange={ ( value ) =>
									updateDimension( 'height', value )
								}
							/>
						</div>
					</div>
					<ToggleControl
						label={ __( 'Auto rotate' ) }
						onChange={ toggleAutoRotate }
						checked={ autoRotate }
						help={
							autoRotate &&
							__(
								'Rotation will always be disabled for users that prefer reduced motion.'
							)
						}
					/>
					<TextareaControl
						label={ __( 'Alt text (alternative text)' ) }
						value={ alt }
						onChange={ updateAlt }
						help={
							<>
								<ExternalLink href="https://www.w3.org/WAI/tutorials/images/decision-tree">
									{ __(
										'Describe the purpose of the 3D model.'
									) }
								</ExternalLink>
								{ __(
									'Leave empty if the model is purely decorative.'
								) }
							</>
						}
					/>
				</PanelBody>
			</InspectorControls>
			<figure { ...blockProps }>
				{ /*
					Disable the model-viewer if the block is not selected
					so the user clicking on it won't interact with the
					model-viewer when the controls are enabled.
				*/ }
				<Disabled isDisabled={ ! isSelected }>
					<model-viewer
						alt={ alt }
						src={ src }
						ar
						ar-modes="webxr scene-viewer quick-look"
						seamless-poster
						shadow-intensity="1"
						camera-controls
						enable-pan
						{ ...autoRotateAttr }
					></model-viewer>
				</Disabled>
			</figure>
		</>
	);
}

export default withNotices( Edit );
