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
import * as richImage from '../blocks/rich-image/src';

// Instantiate the blocks, adding them to our block category
eventBlock.registerBlock();
layoutGridBlock.registerBlock();
richImage.registerBlock();
