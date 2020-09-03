/**
 * External dependencies
 */
import { View } from 'react-native';

/**
 * WordPress dependencies
 */

import { InnerBlocks } from '@wordpress/block-editor';
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
const ALLOWED_BLOCKS = [ 'jetpack/layout-grid-column' ];

const TEMPLATE = [
	[ 'jetpack/layout-grid-column', {}, [] ],
	[ 'jetpack/layout-grid-column', {}, [] ],
];

class Edit extends Component {
	constructor( props ) {
		super( props );
    }

    render() {
        return <View>
            <InnerBlocks
                template={ TEMPLATE }
                templateLock="all"
                allowedBlocks={ ALLOWED_BLOCKS }
            />
        </View>;
    }
}

export default Edit;