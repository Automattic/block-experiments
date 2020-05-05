/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { getFallbackStyle } from './shared';

const Save = ( { attributes } ) => {
	const minHeightWithUnit = attributes.minHeightUnit
		? `${ attributes.minHeight }${ attributes.minHeightUnit }`
		: attributes.minHeight;
	const style = {
		minHeight: minHeightWithUnit || undefined,
		...getFallbackStyle( attributes ),
	};
	return (
		<div style={ style }>
			<canvas
				data-complexity={ attributes.complexity }
				data-mouse-speed={ attributes.mouseSpeed }
				data-fluid-speed={ attributes.fluidSpeed }
				data-color1={ attributes.color1 }
				data-color2={ attributes.color2 }
				data-color3={ attributes.color3 }
				data-color4={ attributes.color4 }
			/>
			<div className="wp-block-a8c-color-effects__inner-container">
				<InnerBlocks.Content />
			</div>
		</div>
	);
};

export default Save;
