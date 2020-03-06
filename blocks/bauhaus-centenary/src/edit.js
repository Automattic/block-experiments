/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	PanelColorSettings,
	withColors,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Placeholder,
	IconButton,
} from '@wordpress/components';
import { ENTER } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import * as Icon from './icon';
import RadioButtonGroup from './radio-button-group';
import categories from './categories';
import heights from './heights';
import colors from './colors';

const Edit = ( {
	className,
	setAttributes,
	attributes,
	backgroundColor,
	setBackgroundColor,
	isSelected,
} ) => {
	const Category = categories[ attributes.category ];
	const { ExtraStyles } = Category || {};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Styles', 'bauhaus-centenary' ) }>
					<div role="listbox">
						{ Object.entries( categories ).map( ( [ category, { label, preview } ] ) => {
							const isCategorySelected = category === attributes.category;
							const classes = classnames( 'styles-panel', {
								'is-selected': isCategorySelected,
							} );
							return (
								<div
									key={ category }
									tabIndex={ 0 }
									role="option"
									aria-selected={ isCategorySelected }
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
					<RadioButtonGroup
						data-selected={ attributes.height }
						options={ heights }
						onChange={ ( height ) => setAttributes( { height } ) }
						selected={ attributes.height }
					/>
					{ ExtraStyles && <ExtraStyles setAttributes={ setAttributes } attributes={ attributes } /> }
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Color', 'bauhaus-centenary' ) }
					initialOpen
					colorSettings={ [
						{
							colors,
							value: backgroundColor.color,
							onChange: setBackgroundColor,
							label: __( 'Background', 'bauhaus-centenary' ),
						},
						{
							colors,
							value: attributes.fill1Color,
							onChange: ( fill1Color ) => setAttributes( { fill1Color } ),
							label: __( 'Fill 1', 'bauhaus-centenary' ),
						},
						{
							colors,
							value: attributes.fill2Color,
							onChange: ( fill2Color ) => setAttributes( { fill2Color } ),
							label: __( 'Fill 2', 'bauhaus-centenary' ),
						},
						{
							colors,
							value: attributes.fill3Color,
							onChange: ( fill3Color ) => setAttributes( { fill3Color } ),
							label: __( 'Fill 3', 'bauhaus-centenary' ),
						},
					] }
				/>
			</InspectorControls>
			{ Category ? (
				<figure
					className={ classnames(
						className,
						backgroundColor.class,
						{ [ `align${ attributes.align }` ]: attributes.align },
					) }
					style={ {
						backgroundColor: backgroundColor.color,
					} }
				>
					<Category attributes={ attributes } setAttributes={ setAttributes } />
					{ ( ! RichText.isEmpty( attributes.caption ) || isSelected ) && (
						<RichText
							tagName="figcaption"
							placeholder={ __( 'Write caption…', 'bauhaus-centenary' ) }
							value={ attributes.caption }
							onChange={ ( caption ) => setAttributes( { caption } ) }
							inlineToolbar
						/>
					) }
				</figure>
			) : (
				<Placeholder
					label={ __( 'Bauhaus Centenary', 'bauhaus-centenary' ) }
					instructions={ __( 'Celebrate the centenary of the design school', 'bauhaus-centenary' ) }
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
			) }
		</>
	);
};

export default withColors( 'backgroundColor' )( Edit );
