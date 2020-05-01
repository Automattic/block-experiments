/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

const Save = ( { attributes } ) => {
	const minHeightWithUnit = attributes.minHeightUnit
		? `${ attributes.minHeight }${ attributes.minHeightUnit }`
		: attributes.minHeight;
	const style = {
		minHeight: minHeightWithUnit || undefined,
		backgroundBlendMode: 'screen',
		background: `linear-gradient( 45deg, ${ attributes.color1 }, rgba( 0, 0, 0, 0 ) 81.11% ),
linear-gradient( 135deg, ${ attributes.color2 }, rgba( 0, 0, 0, 0 ) 81.11% ),
linear-gradient( 225deg, ${ attributes.color3 }, rgba( 0, 0, 0, 0 ) 81.11% ),
linear-gradient( 315deg, ${ attributes.color4 }, rgba( 0, 0, 0, 0 ) 81.11% ),
#000`,
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
