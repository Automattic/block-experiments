/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import defaultColors from './default-colors';
import { getFallbackStyle } from './shared';

const Save = ( { attributes } ) => {
	const colors = {
		color1: attributes.color1 || defaultColors.color1,
		color2: attributes.color2 || defaultColors.color2,
		color3: attributes.color3 || defaultColors.color3,
		color4: attributes.color4 || defaultColors.color4,
	};
	const minHeightWithUnit = attributes.minHeightUnit
		? `${ attributes.minHeight }${ attributes.minHeightUnit }`
		: attributes.minHeight;
	const style = {
		minHeight: minHeightWithUnit || undefined,
		...getFallbackStyle( colors ),
	};
	return (
		<div style={ style }>
			<canvas
				data-complexity={ attributes.complexity }
				data-mouse-speed={ attributes.mouseSpeed }
				data-fluid-speed={ attributes.fluidSpeed }
				data-color1={ colors.color1 }
				data-color2={ colors.color2 }
				data-color3={ colors.color3 }
				data-color4={ colors.color4 }
			/>
			<div className="wp-block-a8c-color-effects__inner-container">
				<InnerBlocks.Content />
			</div>
		</div>
	);
};

export default Save;
