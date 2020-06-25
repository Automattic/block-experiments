/**
 * WordPress dependencies
 */

import { InspectorControls } from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	ButtonGroup,
	SelectControl,
	Disabled,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getLayouts, getColumns, getGutterValues } from '../../constants';
import InsectorColumn from './column';
import ColumnInspectorSettings from './column-settings';

/** @typedef {import('../../constants.js').GetColumn} GetColumn */
/** @typedef {import('../../constants.js').Device} Device */
/** @typedef {import('../../constants.js').ChangeColumnCallback} ChangeColumnCallback */
/** @typedef {import('../edit.js').SetDeviceCallback} SetDeviceCallback */

/**
 * @callback SetAttributesCallback
 * @param {object} attributes - Attributes to change
 */

/**
 * @callback ChangeNumColumnsCallback
 * @param {number} numberOfColumns - New number of columns
 */

/**
 * Inspector control for the Layout Grid
 *
 * @param {object} props - Component props
 * @param {number} props.columnCount - Current number of columns
 * @param {Device} props.device - Current device
 * @param {string} props.gutterSize - Current gutter size
 * @param {boolean} props.addGutterEnds - Add gutter ends
 * @param {SetAttributesCallback} props.setAttributes - Set block attributes
 * @param {ChangeNumColumnsCallback} props.changeNumberOfColumns - Change number of columns
 * @param {GetColumn} props.getColumn - Get details for a column
 * @param {ChangeColumnCallback} props.changeColumn - Set details for a column
 * @param {SetDeviceCallback} props.setDevice - Callback to change the device
 */
function LayoutGridInspector( props ) {
	const {
		columnCount,
		device,
		gutterSize,
		addGutterEnds,
		setAttributes,
		changeNumberOfColumns,
		setDevice,
		getColumn,
		changeColumn,
	} = props;
	const toggleControl = (
		<ToggleControl
			label={ __( 'Add end gutters', 'layout-grid' ) }
			help={
				addGutterEnds
					? __(
							'Toggle off to remove the spacing left and right of the grid.',
							'layout-grid'
					  )
					: __(
							'Toggle on to add space left and right of the layout grid. ',
							'layout-grid'
					  )
			}
			checked={ addGutterEnds }
			onChange={ ( newValue ) =>
				setAttributes( { addGutterEnds: newValue } )
			}
		/>
	);

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Layout', 'layout-grid' ) }>
				<div className="jetpack-layout-grid-columns block-editor-block-styles">
					{ getColumns().map( ( column ) => (
						<InsectorColumn
							column={ column }
							key={ column.value }
							columnCount={ columnCount }
							changeNumberOfColumns={ changeNumberOfColumns }
						/>
					) ) }
				</div>

				<p>
					<em>
						{ __(
							'Changing the number of columns will reset your layout and could remove content.',
							'layout-grid'
						) }
					</em>
				</p>
			</PanelBody>

			<PanelBody title={ __( 'Responsive Breakpoints', 'layout-grid' ) }>
				<p>
					<em>
						{ __(
							"Note that previewing your post will show your browser's breakpoint, not the currently selected one.",
							'layout-grid'
						) }
					</em>
				</p>
				<ButtonGroup>
					{ getLayouts().map( ( layout ) => (
						<Button
							key={ layout.value }
							isPrimary={ layout.value === device }
							onClick={ () => setDevice( layout.value ) }
						>
							{ layout.label }
						</Button>
					) ) }
				</ButtonGroup>

				<ColumnInspectorSettings
					columnCount={ columnCount }
					device={ device }
					onChangeColumn={ changeColumn }
					getColumn={ getColumn }
				/>
			</PanelBody>

			<PanelBody title={ __( 'Gutter', 'layout-grid' ) }>
				<p>{ __( 'Gutter size', 'layout-grid' ) }</p>

				<SelectControl
					value={ gutterSize }
					onChange={ ( newValue ) =>
						setAttributes( {
							gutterSize: newValue,
							addGutterEnds:
								newValue === 'none' ? false : addGutterEnds,
						} )
					}
					options={ getGutterValues() }
				/>

				{ gutterSize === 'none' ? (
					<Disabled>{ toggleControl }</Disabled>
				) : (
					toggleControl
				) }
			</PanelBody>
		</InspectorControls>
	);
}

export default LayoutGridInspector;
