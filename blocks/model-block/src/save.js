import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from './utils.js';

export default function save( { attributes } ) {
	const {
		src,
		alt,
		width,
		height,
		widthUnit,
		heightUnit,
		cameraOrbit,
		fieldOfView,
		autoRotate,
	} = attributes;

	console.log( cameraOrbit, fieldOfView );

	// React stringifies custom properties, so use object destructuring to disable auto-rotate.
	// See https://github.com/facebook/react/issues/9230
	// Gutenberg won't save the value when true is a boolean.
	const autoRotateAttr = autoRotate ? { 'auto-rotate': 'true' } : {};

	return (
		<figure { ...useBlockProps.save() }>
			<model-viewer
				class="wp-block-a8c-model-viewer__component"
				style={ {
					height:
						height && heightUnit
							? `${ height }${ heightUnit }`
							: DEFAULT_HEIGHT,
					width:
						width && widthUnit
							? `${ width }${ widthUnit }`
							: DEFAULT_WIDTH,
				} }
				alt={ alt }
				src={ src }
				ar="true"
				camera-orbit={ cameraOrbit }
				field-of-view={ fieldOfView }
				ar-modes="webxr scene-viewer quick-look"
				seamless-poster="true"
				shadow-intensity="1"
				camera-controls="true"
				enable-pan="true"
				{ ...autoRotateAttr }
			></model-viewer>
		</figure>
	);
}
