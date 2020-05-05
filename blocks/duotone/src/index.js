/**
 * WordPress dependencies
 */
import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { createHigherOrderComponent, useInstanceId } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

const SUPPORTED_BLOCKS = [ 'core/image', 'core/cover' ];

export const isSupportedBlock = ( blockName ) =>
	SUPPORTED_BLOCKS.includes( blockName );

const parseColor = ( color ) => {
	if ( ! color ) return {};

	let r = '0';
	let g = '0';
	let b = '0';

	if ( color.length === 7 ) {
		r = '0x' + color[ 1 ] + color[ 2 ];
		g = '0x' + color[ 3 ] + color[ 4 ];
		b = '0x' + color[ 5 ] + color[ 6 ];
	} else if ( color.length === 4 ) {
		r = '0x' + color[ 1 ] + color[ 1 ];
		g = '0x' + color[ 2 ] + color[ 2 ];
		b = '0x' + color[ 3 ] + color[ 3 ];
	}

	return {
		r: r / 0xff,
		g: g / 0xff,
		b: b / 0xff,
	};
};

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
		const duotoneDark = parseColor( attributes.duotoneDark );
		const duotoneLight = parseColor( attributes.duotoneLight );

		useEffect( () => {
			setAttributes( { duotoneId: `a8c-duotone-${ instanceId }` } );
		}, [ instanceId ] );

		return (
			<>
				<InspectorControls>
					<PanelColorSettings
						title={ __( 'Duotone', 'duotone' ) }
						initialOpen
						colorSettings={ [
							{
								label: __( 'Dark Color', 'duotone' ),
								value: attributes.duotoneDark,
								onChange: ( duotoneDark ) =>
									setAttributes( { duotoneDark } ),
							},
							{
								label: __( 'Light Color', 'duotone' ),
								value: attributes.duotoneLight,
								onChange: ( duotoneLight ) =>
									setAttributes( { duotoneLight } ),
							},
						] }
					/>
				</InspectorControls>
				<svg
					viewBox="0 0 0 0"
					width="0"
					height="0"
					xmlnsXlink="http://www.w3.org/1999/xlink"
					style={ {
						visibility: 'hidden',
						position: 'absolute',
						left: '-9999px',
						overflow: 'hidden',
					} }
					ariaHidden="true"
					focusable="false"
					role="none"
				>
					<defs>
						<filter id={ attributes.duotoneId }>
							<feColorMatrix
								type="matrix"
								// prettier-ignore
								values=".33 .33 .33 0 0
									.33 .33 .33 0 0
									.33 .33 .33 0 0
									0 0 0 1 0"
							/>
							<feComponentTransfer colorInterpolationFilters="sRGB">
								<feFuncR
									type="table"
									tableValues={ `${ duotoneDark.r } ${ duotoneLight.r }` }
								/>
								<feFuncG
									type="table"
									tableValues={ `${ duotoneDark.g } ${ duotoneLight.g }` }
								/>
								<feFuncB
									type="table"
									tableValues={ `${ duotoneDark.b } ${ duotoneLight.b }` }
								/>
							</feComponentTransfer>
						</filter>
					</defs>
				</svg>
				<div style={ { filter: `url( #${ attributes.duotoneId } )` } }>
					<BlockEdit { ...props } />
				</div>
			</>
		);
	},
	'withDuotoneEditorControls'
);

function addDuotoneFilterStyle( props, block, attributes ) {
	if ( ! isSupportedBlock( block.name ) ) return props;
	const { style = {} } = props;
	return { style: { ...style, filter: `url( #${ attributes.duotoneId } )` } };
}

export function registerBlock() {
	addFilter(
		'editor.BlockEdit',
		'a8c/duotone/with-editor-controls',
		withDuotoneEditorControls
	);
	addFilter(
		'blocks.registerBlockType',
		'a8c/duotone/add-attributes',
		withDuotoneAttributes
	);
	addFilter(
		'blocks.getSaveContent.extraProps',
		'a8c/duotone/add-filter-style',
		addDuotoneFilterStyle
	);
}
