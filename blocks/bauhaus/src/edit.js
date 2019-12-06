/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	AlignmentToolbar,
	BlockControls,
	InspectorControls,
	PanelColorSettings,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Placeholder,
	SelectControl,
	IconButton,
} from '@wordpress/components';
import { ENTER } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import * as Icon from './icon';
import RadioButtonGroup from './radio-button-group';

const colors = [
	{ name: 'Black', color: '#000000' },
	{ name: 'Blue', color: '#051BF4' },
	{ name: 'Red', color: '#D32121' },
	{ name: 'Yellow', color: '#F7FC1C' },
	{ name: 'White', color: '#FFFFFF' },
];

const categories = {
	forms: {
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
	},
	year: {
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
	},
	ribbon: {
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
	},
};

const Edit = ( { className, setAttributes, attributes } ) => {
	const categorySettings = categories[ attributes.category ];
	const ColorPanel = categorySettings ? categorySettings.ColorPanel : () => null;
	const StyleSettings = categorySettings ? categorySettings.StyleSettings : () => null;

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={ attributes.align }
					onChange={ ( align ) => setAttributes( { align } ) }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Styles' ) }>
					<div role="listbox">
						{ Object.entries( categories ).map( ( [ category, { label, preview } ] ) => {
							const isSelected = category === attributes.category;
							const classes = classnames( 'styles-panel', {
								'is-selected': isSelected,
							} );
							return (
								<div
									key={ category }
									tabIndex={ 0 }
									role="option"
									aria-selected={ isSelected }
									className={ classes }
									onClick={ () => setAttributes( { category } ) }
									onKeyDown={ ( event ) =>
										event.keyCode === ENTER ?
											setAttributes( { category } ) :
											null
									}
								>
									<div className="styles-panel__preview">{ preview }</div>
									<p className="styles-panel__label">{ label }</p>
								</div>
							);
						} ) }
					</div>
					<StyleSettings setAttributes={ setAttributes } attributes={ attributes } />
				</PanelBody>
				<ColorPanel setAttributes={ setAttributes } attributes={ attributes } />
			</InspectorControls>
			<Placeholder
				label={ __( 'Bauhaus' ) }
				instructions={ __( 'Celebrate the centenary of the design school' ) }
				icon={ <Icon.BauhausIcon /> }
				className={ className }
			>
				{ Object.entries( categories ).map( ( [ category, { label, icon } ] ) => (
					<IconButton
						icon={ icon }
						isDefault
						key={ category }
						label={ label }
						onClick={ () => setAttributes( { category } ) }
					/>
				) ) }
			</Placeholder>
		</>
	);
};

export default Edit;
