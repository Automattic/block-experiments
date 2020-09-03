/**
 * External dependencies
 */
import { View } from 'react-native';

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';
import { Component } from '@wordpress/element';

class Edit extends Component {
	constructor( props ) {
		super( props );
    }

    render() {
	
        return <View>
            <InnerBlocks
					templateLock={ false }
					renderAppender={ this.props.hasChildBlocks
						? undefined
						: () => <InnerBlocks.ButtonBlockAppender />
					}
				/>
        </View>;
    }
}

export default Edit;