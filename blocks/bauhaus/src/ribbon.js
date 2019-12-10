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

const Ribbon = ( { size } ) => {
	switch ( size ) {
		case 'centered':
			return <Icon.RibbonCentered />;
		case 'full-width':
			return <Icon.RibbonFull />;
		default:
			return null;
	}
};

Object.assign( Ribbon, {
	label: 'Ribbon',
	icon: <Icon.RibbonIcon />,
	preview: <Icon.RibbonPreview />,
	ColorPanel: ( { setAttributes, attributes } ) => (
		<PanelColorSettings
			title={ __( 'Color' ) }
			initialOpen
			colorSettings={ [
				{
					colors,
					value: attributes.ribbonFill,
					onChange: ( ribbonFill ) => setAttributes( { ribbonFill } ),
					label: __( 'Fill' ),
				},
				{
					colors,
					value: attributes.ribbonBackgroundFill,
					onChange: ( ribbonBackgroundFill ) => setAttributes( { ribbonBackgroundFill } ),
					label: __( 'Background Fill' ),
				},
			] }
		/>
	),
	StyleSettings: ( { setAttributes, attributes } ) => (
		<>
			<RadioButtonGroup
				options={ [
					{ label: __( 'Centered' ), value: 'centered' },
					{ label: __( 'Full-width' ), value: 'full-width' },
				] }
				onChange={ ( ribbonSize ) => setAttributes( { ribbonSize } ) }
				selected={ attributes.ribbonSize }
			/>
		</>
	),
} );

export default Ribbon;
