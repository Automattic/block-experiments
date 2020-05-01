/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import defaultColors from './default-colors';

const Save = ( { attributes } ) => {
	const color1OrDefault = attributes.color1 || defaultColors.color1;
	const color2OrDefault = attributes.color2 || defaultColors.color2;
	const color3OrDefault = attributes.color3 || defaultColors.color3;
	const color4OrDefault = attributes.color4 || defaultColors.color4;
	const minHeightWithUnit = attributes.minHeightUnit
		? `${ attributes.minHeight }${ attributes.minHeightUnit }`
		: attributes.minHeight;
	const style = {
		minHeight: minHeightWithUnit || undefined,
		backgroundBlendMode: 'screen',
		background: `linear-gradient( 45deg, ${ color1OrDefault }, rgba( 0, 0, 0, 0 ) 81.11% ),
linear-gradient( 135deg, ${ color2OrDefault }, rgba( 0, 0, 0, 0 ) 81.11% ),
linear-gradient( 225deg, ${ color3OrDefault }, rgba( 0, 0, 0, 0 ) 81.11% ),
linear-gradient( 315deg, ${ color4OrDefault }, rgba( 0, 0, 0, 0 ) 81.11% ),
#000`,
	};
	return (
		<div style={ style }>
			<canvas
				data-complexity={ attributes.complexity }
				data-mouse-speed={ attributes.mouseSpeed }
				data-fluid-speed={ attributes.fluidSpeed }
				data-color1={ color1OrDefault }
				data-color2={ color2OrDefault }
				data-color3={ color3OrDefault }
				data-color4={ color4OrDefault }
			/>
			<div className="wp-block-a8c-color-effects__inner-container">
				<InnerBlocks.Content />
			</div>
		</div>
	);
};

export default Save;
