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
import * as bauhausCentenaryBlock from '../blocks/bauhaus-centenary/src';
import * as eventBlock from '../blocks/event/src';
import * as juxtaposeBlock from '../blocks/juxtapose/src';
import * as layoutGridBlock from '../blocks/layout-grid/src';
import * as motionBackgroundBlock from '../blocks/motion-background/src';
import * as richImageTools from '../blocks/rich-image/src';
import * as starscapeBlock from '../blocks/starscape/src';

// Instantiate the blocks, adding them to our block category
bauhausCentenaryBlock.registerBlock();
eventBlock.registerBlock();
juxtaposeBlock.registerBlock();
layoutGridBlock.registerBlock();
motionBackgroundBlock.registerBlock();
richImageTools.registerBlock();
starscapeBlock.registerBlock();
