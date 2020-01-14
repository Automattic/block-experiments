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
		slug: 'wpcom-blocks',
		title: 'Block Experiments',
		icon: <TinkerBlocksLogo />,
	},
	...getCategories(),
] );

/**
 * Load all our blocks
 */
import * as eventBlock from '../blocks/event/src';
import * as layoutGridBlock from '../blocks/layout-grid/src';
import * as richImageTools from '../blocks/rich-image/src';
import * as bauhausCentenaryBlock from '../blocks/bauhaus-centenary/src';
import * as starscapeBlock from '../blocks/starscape/src';
import * as motionBackgroundBlock from '../blocks/motion-background/src';

// Instantiate the blocks, adding them to our block category
eventBlock.registerBlock();
layoutGridBlock.registerBlock();
richImageTools.registerBlock();
bauhausCentenaryBlock.registerBlock();
starscapeBlock.registerBlock();
motionBackgroundBlock.registerBlock();
