/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

const edit = ( { className } ) => (
	<div className={ className }>
		<InnerBlocks />
	</div>
);

export default edit;
