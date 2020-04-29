/**
 * WordPress dependencies
 */
import {
	InspectorControls,
	PanelColorSettings,
	InnerBlocks,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const Edit = ( { attributes, setAttributes, className } ) => {
	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Animation' ) } initialOpen>
					<RangeControl
						label={ __( 'Complexity' ) }
						value={ attributes.complexity }
						onChange={ ( complexity ) =>
							setAttributes( { complexity } )
						}
						min={ 2 }
						max={ 32 }
					/>
					<RangeControl
						label={ __( 'Mouse Speed' ) }
						value={ attributes.mouseSpeed }
						onChange={ ( mouseSpeed ) =>
							setAttributes( { mouseSpeed } )
						}
						min={ 1 }
						max={ 100 }
					/>
					<RangeControl
						label={ __( 'Fluid Speed' ) }
						value={ attributes.fluidSpeed }
						onChange={ ( fluidSpeed ) =>
							setAttributes( { fluidSpeed } )
						}
						min={ 1 }
						max={ 100 }
					/>
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Color' ) }
					initialOpen
					colorSettings={ [
						{
							label: __( 'Gradient 1' ),
							value: attributes.color1,
							onChange: ( color1 ) => setAttributes( { color1 } ),
						},
						{
							label: __( 'Gradient 2' ),
							value: attributes.color2,
							onChange: ( color2 ) => setAttributes( { color2 } ),
						},
						{
							label: __( 'Gradient 3' ),
							value: attributes.color3,
							onChange: ( color3 ) => setAttributes( { color3 } ),
						},
						{
							label: __( 'Gradient 4' ),
							value: attributes.color4,
							onChange: ( color4 ) => setAttributes( { color4 } ),
						},
					] }
				/>
			</InspectorControls>
			<div className={ className }>
				<canvas
					data-complexity={ attributes.complexity }
					data-mouse-speed={ attributes.mouseSpeed }
					data-fluid-speed={ attributes.fluidSpeed }
					data-color1={ attributes.color1 }
					data-color2={ attributes.color2 }
					data-color3={ attributes.color3 }
					data-color4={ attributes.color4 }
				/>
				<InnerBlocks />
			</div>
		</>
	);
};

export default Edit;
