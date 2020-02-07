/**
 * WordPress dependencies
 */
import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Save from './save';

const Edit = ( { className, attributes, setAttributes } ) => {
	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Paint' ) }
					initialOpen
				>
					<RangeControl
						label={ __( 'Complexity' ) }
						value={ attributes.complexity }
						onChange={ ( complexity ) => setAttributes( { complexity } ) }
						min={ 2 }
						max={ 32 }
					/>
					<RangeControl
						label={ __( 'Mouse Speed' ) }
						value={ attributes.mouseSpeed }
						onChange={ ( mouseSpeed ) => setAttributes( { mouseSpeed } ) }
						min={ 1 }
						max={ 100 }
					/>
					<RangeControl
						label={ __( 'Fluid Speed' ) }
						value={ attributes.fluidSpeed }
						onChange={ ( fluidSpeed ) => setAttributes( { fluidSpeed } ) }
						min={ 1 }
						max={ 100 }
					/>
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Color' ) }
					initialOpen
					colorSettings={ [
						{
							label: __( 'Color 1' ),
							value: attributes.color1,
							onChange: ( color1 ) => setAttributes( { color1 } ),
						},
						{
							label: __( 'Color 2' ),
							value: attributes.color2,
							onChange: ( color2 ) => setAttributes( { color2 } ),
						},
						{
							label: __( 'Color 3' ),
							value: attributes.color3,
							onChange: ( color3 ) => setAttributes( { color3 } ),
						},
						{
							label: __( 'Color 4' ),
							value: attributes.color4,
							onChange: ( color4 ) => setAttributes( { color4 } ),
						},
					] }
				/>
			</InspectorControls>
			<Save className={ className } attributes={ attributes } />
		</>
	);
};

export default Edit;
