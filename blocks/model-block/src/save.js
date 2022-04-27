/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save() {
	return (
		<div { ...useBlockProps.save() }>
			<p>{ __(
				'3D Model Block – hello from the editor!',
				'3d-model-block'
			) }</p>
			<model-viewer
				alt="Neil Armstrong's Spacesuit from the Smithsonian Digitization Programs Office and National Air and Space Museum"
				src="https://modelviewer.dev/assets/ShopifyModels/Chair.glb"
				ar="true"
				ar-modes="webxr scene-viewer quick-look"
				seamless-poster="true"
				shadow-intensity="1"
				camera-controls="true"
				enable-pan="true"
				>
			</model-viewer>
		</div>
	);
}