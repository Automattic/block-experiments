/**
 * External dependencies
 */
import { View } from 'react-native';
import { delay, flatMap } from 'lodash';

/**
 * WordPress dependencies
 */
import { InnerBlocks, BlockVariationPicker } from '@wordpress/block-editor';

import { useEffect, useState } from '@wordpress/element';
/**
 * Internal dependencies
 */
import variations from './variations';

const ALLOWED_BLOCKS = [ 'jetpack/layout-grid-column' ];

const TEMPLATE = [
	[ 'jetpack/layout-grid-column', {}, [] ],
	[ 'jetpack/layout-grid-column', {}, [] ],
];

const Edit = ( props ) => {
	const { clientId, isSelected } = props;
	const [ isVisible, setIsVisible ] = useState( false );
	const isDefaultColumns = true;

	useEffect( () => {
		if ( isSelected && isDefaultColumns ) {
			delay( () => setIsVisible( true ), 100 );
		}
	}, [] );

	return (
		<>
			<View>
				<InnerBlocks
					template={ TEMPLATE }
					templateLock="all"
					allowedBlocks={ ALLOWED_BLOCKS }
				/>
			</View>
			<BlockVariationPicker
				variations={ variations }
				onClose={ () => setIsVisible( false ) }
				clientId={ clientId }
				isVisible={ isVisible }
			/>
		</>
	);
};

export default Edit;
