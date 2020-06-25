/**
 * WordPress dependencies
 */

import {
	BlockControls,
	BlockVerticalAlignmentToolbar,
} from '@wordpress/block-editor';
import {
	Button,
	ToolbarGroup,
	MenuGroup,
	MenuItem,
	Dropdown,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { getLayouts } from '../../constants';

/** @typedef {import('../edit.js').SetDeviceCallback} SetDeviceCallback */
/** @typedef {import('../edit.js').VerticalAlignment} VerticalAlignment */
/** @typedef {import('../edit.js').SetAlignmentCallback} SetAlignmentCallback */
/** @typedef {import('../../constants.js').Device} Device */

/**
 * Block controls for the Layout Grid
 *
 * @param {object} props - Component props
 * @param {Device} props.device - Current device
 * @param {SetDeviceCallback} props.setDevice - Callback to change the device
 * @param {VerticalAlignment} props.verticalAlignment - Vertical verticalAlignment
 * @param {SetAlignmentCallback} props.setVerticalAlignment - Callback to change the vertical alignment
 */
function LayoutGridBlockControls( props ) {
	const {
		device,
		setDevice,
		verticalAlignment,
		setVerticalAlignment,
	} = props;

	return (
		<BlockControls>
			<BlockVerticalAlignmentToolbar
				onChange={ setVerticalAlignment }
				value={ verticalAlignment }
			/>
			<Dropdown
				renderToggle={ ( { isOpen, onToggle } ) => (
					<ToolbarGroup>
						<Button
							aria-expanded={ isOpen }
							onClick={ onToggle }
							// @ts-ignore
							icon={
								getLayouts().find(
									( layout ) => layout.value === device
								).icon
							}
						/>
					</ToolbarGroup>
				) }
				renderContent={ ( { onClose } ) => (
					<MenuGroup>
						{ getLayouts().map( ( layout ) => (
							<MenuItem
								key={ layout.value }
								isSelected={ layout.value === device }
								onClick={ ( ev ) => setDevice( layout.value ) }
								icon={ layout.icon }
							>
								{ layout.label }
							</MenuItem>
						) ) }
					</MenuGroup>
				) }
			/>
		</BlockControls>
	);
}

export default LayoutGridBlockControls;
