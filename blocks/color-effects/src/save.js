/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

const Save = ( { attributes } ) => {
	return (
		<div>
			<canvas
				data-complexity={ attributes.complexity }
				data-mouse-speed={ attributes.mouseSpeed }
				data-fluid-speed={ attributes.fluidSpeed }
				data-color1={ attributes.color1 }
				data-color2={ attributes.color2 }
				data-color3={ attributes.color3 }
				data-color4={ attributes.color4 }
			/>
			<InnerBlocks.Content />
		</div>
	);
};

export default Save;
