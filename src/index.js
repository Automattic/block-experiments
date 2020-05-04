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
import * as duotoneBlock from '../blocks/duotone/src';
import * as eventBlock from '../blocks/event/src';
import * as layoutGridBlock from '../blocks/layout-grid/src';
import * as motionBackgroundBlock from '../blocks/motion-background/src';
import * as starscapeBlock from '../blocks/starscape/src';
import * as wavesBlock from '../blocks/waves/src';

// Instantiate the blocks, adding them to our block category
bauhausCentenaryBlock.registerBlock();
duotoneBlock.registerBlock();
eventBlock.registerBlock();
layoutGridBlock.registerBlock();
motionBackgroundBlock.registerBlock();
starscapeBlock.registerBlock();
wavesBlock.registerBlock();
