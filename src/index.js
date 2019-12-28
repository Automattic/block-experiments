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
import * as layoutGridBlock from '../blocks/layout-grid/src';
import * as richImageTools from '../blocks/rich-image/src';
import * as strikeThatBlock from '../blocks/strike-that/src';

// Instantiate the blocks, adding them to our block category
bauhausCentenaryBlock.registerBlock();
eventBlock.registerBlock();
layoutGridBlock.registerBlock();
richImageTools.registerBlock();
strikeThatBlock.registerBlock();
