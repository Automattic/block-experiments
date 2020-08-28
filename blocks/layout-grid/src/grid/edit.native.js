/**
 * External dependencies
 */
import { View, AccessibilityInfo, Platform, Text } from 'react-native';
import { times } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */

import {
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { Component, createRef } from '@wordpress/element';
import {
	BlockControls,
	BlockVerticalAlignmentToolbar,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ButtonGroup,
	Button,
	IconButton,
	Placeholder,
	IsolatedEventContainer,
	ToggleControl,
	SelectControl,
	Disabled,
	ToolbarGroup,
	MenuGroup,
	MenuItem,
	Dropdown,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ENTER, SPACE } from '@wordpress/keycodes';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { createBlock } from '@wordpress/blocks';


/**
 * Internal dependencies
 */
import ColumnIcon from '../icons';
import { getLayouts } from '../constants';

const ALLOWED_BLOCKS = [ 'jetpack/layout-grid-column' ];

class Edit extends Component {
	constructor( props ) {
		super( props );
    }

    render() {
        return <View>
            <InnerBlocks
                template={ null }
                templateLock="all"
                allowedBlocks={ ALLOWED_BLOCKS }
            />
        </View>;
    }
}

export default Edit;