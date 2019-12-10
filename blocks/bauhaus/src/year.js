/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelColorSettings } from '@wordpress/block-editor';
import { SelectControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import * as Icon from './icon';
import colors from './colors';
import RadioButtonGroup from './radio-button-group';

const Year = ( { display } ) => {
	switch ( display ) {
		case '1919':
			return <Icon.Year1919 />;
		case '2019':
			return <Icon.Year2019 />;
		case 'range':
			return <Icon.YearRange />;
		default:
			return null;
	}
};

Object.assign( Year, {
	label: 'Year',
	icon: <Icon.YearIcon />,
	preview: <Icon.YearPreview />,
	ColorPanel: ( { setAttributes, attributes } ) => (
		<PanelColorSettings
			title={ __( 'Color' ) }
			initialOpen
			colorSettings={ [
				{
					colors,
					value: attributes.yearFill,
					onChange: ( yearFill ) => setAttributes( { yearFill } ),
					label: __( 'Fill' ),
				},
				{
					colors,
					value: attributes.yearBackgroundFill,
					onChange: ( yearBackgroundFill ) => setAttributes( { yearBackgroundFill } ),
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
				onChange={ ( yearSize ) => setAttributes( { yearSize } ) }
				selected={ attributes.yearSize }
			/>
			<SelectControl
				options={ [
					{ label: __( '1919' ), value: '1919' },
					{ label: __( '2019' ), value: '2019' },
					{ label: __( '1919–2019' ), value: 'range' },
				] }
				onChange={ ( yearDisplay ) => setAttributes( { yearDisplay } ) }
			/>
		</>
	),
} );

export default Year;
