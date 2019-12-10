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

import forms from './forms';
import year from './year';
import ribbon from './ribbon';

const categories = { forms, year, ribbon };

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
