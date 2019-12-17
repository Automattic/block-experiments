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
	const { ExtraStyles, extraColors } = Category || {};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Styles' ) }>
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
					title={ __( 'Color' ) }
					initialOpen
					colorSettings={ [
						{
							colors,
							value: backgroundColor.color,
							onChange: setBackgroundColor,
							label: __( 'Background' ),
						},
						...( extraColors ? extraColors( { attributes, setAttributes } ) : [] ),
					] }
				/>
			</InspectorControls>
			{ Category ? (
				<figure
					className={ classnames(
						className,
						backgroundColor.class,
					) }
					style={ {
						backgroundColor: backgroundColor.color,
					} }
				>
					<Category attributes={ attributes } setAttributes={ setAttributes } />
					{ ( ! RichText.isEmpty( attributes.caption ) || isSelected ) && (
						<RichText
							tagName="figcaption"
							placeholder={ __( 'Write caption…' ) }
							value={ attributes.caption }
							onChange={ ( caption ) => setAttributes( { caption } ) }
							inlineToolbar
						/>
					) }
				</figure>
			) : (
				<Placeholder
					label={ __( 'Bauhaus Centenary' ) }
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
			) }
		</>
	);
};

export default withColors( 'backgroundColor' )( Edit );
