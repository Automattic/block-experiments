/**
 * WordPress dependencies
 */
import { InspectorControls } from '@wordpress/block-editor';
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
				<PanelBody title={ __( 'Paint' ) } initialOpen>
					<RangeControl
						label={ __( 'Complexity' ) }
						value={ attributes.complexity }
						onChange={ ( complexity ) => setAttributes( { complexity } ) }
						min={ 2 }
						max={ 32 }
						allowReset
					/>
					<RangeControl
						label={ __( 'Mouse Speed' ) }
						value={ attributes.mouseSpeed }
						onChange={ ( mouseSpeed ) => setAttributes( { mouseSpeed } ) }
						min={ 1 }
						max={ 100 }
						allowReset
					/>
					<RangeControl
						label={ __( 'Mouse Curling' ) }
						value={ attributes.mouseCurls }
						onChange={ ( mouseCurls ) => setAttributes( { mouseCurls } ) }
						min={ 1 }
						max={ 100 }
						allowReset
					/>
					<RangeControl
						label={ __( 'Fluid Speed' ) }
						value={ attributes.fluidSpeed }
						onChange={ ( fluidSpeed ) => setAttributes( { fluidSpeed } ) }
						min={ 1 }
						max={ 100 }
						allowReset
					/>
					<RangeControl
						label={ __( 'Color Intensity' ) }
						value={ attributes.colorIntensity }
						onChange={ ( colorIntensity ) => setAttributes( { colorIntensity } ) }
						min={ 1 }
						max={ 100 }
						allowReset
					/>
				</PanelBody>
			</InspectorControls>
			<Save className={ className } attributes={ attributes } />
		</>
	);
};

export default Edit;
