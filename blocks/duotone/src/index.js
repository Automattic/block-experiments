/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import * as cover from './cover';
import * as image from './image';

export function registerBlock() {
	registerBlockType( cover.name, { ...cover.settings, ...cover.metadata } );
	registerBlockType( image.name, { ...image.settings, ...image.metadata } );
}
