import '@google/model-viewer';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	TextControl,
	TextareaControl,
	ExternalLink,
	Disabled,
} from '@wordpress/components';
import {
	BlockControls,
	BlockIcon,
	InspectorControls,
	MediaPlaceholder,
	MediaReplaceFlow,
	useBlockProps,
} from '@wordpress/block-editor';

import { icon } from './icon';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( { attributes, isSelected } ) {
	const { id, src, alt, width, height } = attributes;

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

	const blockProps = useBlockProps();

	if ( ! src ) {
		return (
			<div { ...blockProps }>
				<MediaPlaceholder
					icon={ <BlockIcon icon={ icon } /> }
					onSelect={ onSelectModel }
					onSelectURL={ onSelectURL }
					accept="model/*"
					allowedTypes="model"
					value={ attributes }
					notices={ noticeUI }
					onError={ onUploadError }
				/>
			</div>
		);
	}

	return (
		<>
			<BlockControls group="other">
				<MediaReplaceFlow
					mediaId={ id }
					mediaURL={ src }
					allowedTypes="model"
					accept={ [ 'model/gltf+json', 'model/gltf-binary' ] }
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
									'Leave empty if the image is purely decorative.'
								) }
							</>
						}
					/>
				</PanelBody>
			</InspectorControls>
			<figure { ...blockProps }>
				{ /*
					Disable the video tag if the block is not selected
					so the user clicking on it won't play the
					video when the controls are enabled.
				*/ }
				<Disabled isDisabled={ ! isSelected }>
					<div { ...useBlockProps() }>
						<model-viewer
							alt={ alt }
							src={ src }
							ar
							ar-modes="webxr scene-viewer quick-look"
							seamless-poster
							shadow-intensity="1"
							camera-controls
							enable-pan
						></model-viewer>
					</div>
				</Disabled>
			</figure>
		</>
	);
}
