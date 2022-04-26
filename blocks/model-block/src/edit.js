import '@google/model-viewer';
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
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit() {
	return (
		<div { ...useBlockProps() }>
			<p>{ __(
				'3D Model Block – hello from the editor!',
				'3d-model-block'
			) }</p>
			<model-viewer
				alt="Neil Armstrong's Spacesuit from the Smithsonian Digitization Programs Office and National Air and Space Museum"
				src="https://modelviewer.dev/assets/ShopifyModels/Chair.glb"
				ar
				ar-modes="webxr scene-viewer quick-look"
				seamless-poster
				shadow-intensity="1"
				camera-controls
				enable-pan
			>
			</model-viewer>
		</div>
	);
}
