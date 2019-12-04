/**
 * WordPress dependencies
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { isSupportedBlock, richImageAttributes } from './constants';
import RichImage from './rich-image';

const addRichImageAttributes = ( settings, name ) => {
	if ( ! isSupportedBlock( name ) ) {
		return settings;
	}

	settings.attributes = Object.assign( settings.attributes, richImageAttributes );

	return settings;
};

const addRichImage = createHigherOrderComponent( ( OriginalBlock ) => {
	return ( props ) => {
		if ( ! isSupportedBlock( props.name ) ) {
			return (
				<OriginalBlock { ...props } />
			);
		}

		return (
			<RichImage { ...props } originalBlock={ OriginalBlock } />
		);
	};
}, 'addRichImage' );

export function registerBlock() {
	addFilter( 'editor.BlockEdit', 'jetpack/rich-image', addRichImage );
	addFilter( 'blocks.registerBlockType', 'jetpack/rich-image/attributes', addRichImageAttributes );
}
