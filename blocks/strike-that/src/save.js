/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';
/**
 * Internal dependencies
 */
import Scribble from './scribble';

const save = ( { className } ) => (
	<div className={ className }>
		<Scribble />
		<InnerBlocks.Content />
	</div>
);

export default save;
