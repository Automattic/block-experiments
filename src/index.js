/**
 * WordPress dependencies
 */

import { getCategories, setCategories } from '@wordpress/blocks';

/**
 * Internal dependencies
 */

import { TinkerBlocksLogo } from './block-icons';

setCategories( [
	{
		slug: 'block-experiments',
		title: 'Block Experiments',
		icon: <TinkerBlocksLogo />,
	},
	...getCategories(),
] );

/**
 * Load all our blocks
 */
import * as bauhausCentenaryBlock from '../blocks/bauhaus-centenary/src';
import * as eventBlock from '../blocks/event/src';
import * as layoutGridBlock from '../blocks/layout-grid/src';
import * as sketchBlock from '../blocks/sketch/src';
import * as starscapeBlock from '../blocks/starscape/src';
import * as wavesBlock from '../blocks/waves/src';
import * as bookBlock from '../blocks/book/src';
import * as modelViewerBlock from '../blocks/model-viewer/src';

// Instantiate the blocks, adding them to our block category
bauhausCentenaryBlock.registerBlock();
eventBlock.registerBlock();
layoutGridBlock.registerBlock();
sketchBlock.registerBlock();
starscapeBlock.registerBlock();
wavesBlock.registerBlock();
bookBlock.registerBlock();
modelViewerBlock.registerBlock();
