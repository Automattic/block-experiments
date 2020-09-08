/**
 * WordPress dependencies
 */
import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { createHigherOrderComponent, useInstanceId } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Duotone from './duotone';

const SUPPORTED_BLOCKS = [ 'core/image' ];

export const isSupportedBlock = ( blockName ) =>
	SUPPORTED_BLOCKS.includes( blockName );

const withDuotoneAttributes = ( settings, blockName ) => {
	if ( isSupportedBlock( blockName ) ) {
		Object.assign( settings.attributes, {
			duotoneId: {
				type: 'string',
			},
			duotoneDark: {
				type: 'string',
			},
			duotoneLight: {
				type: 'string',
			},
		} );
	}
	return settings;
};

const withDuotoneEditorControls = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name: blockName, attributes, setAttributes } = props;

		if ( ! isSupportedBlock( blockName ) ) {
			return <BlockEdit { ...props } />;
		}

		const instanceId = useInstanceId( BlockEdit );

		useEffect( () => {
			setAttributes( {
				duotoneId: `a8c-duotone-filter-${ instanceId }`,
			} );
		}, [ instanceId ] );

		return (
			<>
				<InspectorControls>
					<PanelColorSettings
						title={ __( 'Duotone', 'block-experiments' ) }
						initialOpen
						colorSettings={ [
							{
								label: __( 'Dark Color', 'block-experiments' ),
								value: attributes.duotoneDark,
								onChange: ( duotoneDark ) =>
									setAttributes( { duotoneDark } ),
							},
							{
								label: __( 'Light Color', 'block-experiments' ),
								value: attributes.duotoneLight,
								onChange: ( duotoneLight ) =>
									setAttributes( { duotoneLight } ),
							},
						] }
					/>
				</InspectorControls>
				{ attributes.duotoneDark &&
				attributes.duotoneLight &&
				attributes.duotoneId ? (
					<>
						<Duotone
							id={ attributes.duotoneId }
							darkColor={ attributes.duotoneDark }
							lightColor={ attributes.duotoneLight }
						/>
						<div
							style={ {
								filter: `url( #${ attributes.duotoneId } )`,
							} }
						>
							<BlockEdit { ...props } />
						</div>
					</>
				) : (
					<BlockEdit { ...props } />
				) }
			</>
		);
	},
	'withDuotoneEditorControls'
);

function addDuotoneFilterStyle( props, block, attributes ) {
	if (
		! isSupportedBlock( block.name ) ||
		! attributes.duotoneDark ||
		! attributes.duotoneLight ||
		! attributes.duotoneId
	) {
		return props;
	}

	const { style = {} } = props;

	return { style: { ...style, filter: `url( #${ attributes.duotoneId } )` } };
}

export function registerBlock() {
	addFilter(
		'editor.BlockEdit',
		'a8c/duotone-filter/with-editor-controls',
		withDuotoneEditorControls
	);
	addFilter(
		'blocks.registerBlockType',
		'a8c/duotone-filter/add-attributes',
		withDuotoneAttributes
	);
	addFilter(
		'blocks.getSaveContent.extraProps',
		'a8c/duotone-filter/add-filter-style',
		addDuotoneFilterStyle
	);
}
