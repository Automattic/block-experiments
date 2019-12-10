/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelColorSettings } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import * as Icon from './icon';
import colors from './colors';
import RadioButtonGroup from './radio-button-group';

const Forms = ( {} ) => {
	return (
		<div className="forms">
			<Icon.FormTriangle />
			<Icon.FormSquare />
			<Icon.FormCircle />
		</div>
	);
};

Object.assign( Forms, {
	label: 'Forms',
	icon: <Icon.FormsIcon />,
	preview: <Icon.FormsPreview />,
	ColorPanel: ( { setAttributes, attributes } ) => (
		<PanelColorSettings
			title={ __( 'Color' ) }
			initialOpen
			colorSettings={ [
				{
					colors,
					value: attributes.formsBackgroundFill,
					onChange: ( formsBackgroundFill ) => setAttributes( { formsBackgroundFill } ),
					label: __( 'Background Fill' ),
				},
			] }
		/>
	),
	StyleSettings: ( { setAttributes, attributes } ) => (
		<>
			<RadioButtonGroup
				options={ [
					{ label: __( 'Small' ), value: 'small' },
					{ label: __( 'Medium' ), value: 'medium' },
					{ label: __( 'Large' ), value: 'large' },
				] }
				onChange={ ( formsSize ) => setAttributes( { formsSize } ) }
				selected={ attributes.formsSize }
			/>
		</>
	),
} );

export default Forms;
