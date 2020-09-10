/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { createHigherOrderComponent, useInstanceId } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Duotone from './duotone';
import { hex2rgb } from './utils';

const FALLBACK_DARK_COLOR = '#000';
const FALLBACK_LIGHT_COLOR = '#fff';

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

/**
 * Convert a hex color to perceived brightness.
 *
 * @param {string} color Hex color
 * @return {number} Perceived brightness of the color
 */
const toBrightness = ( color ) => {
	const { r, g, b } = hex2rgb( color );
	return r * 0.299 + g * 0.587 + b * 0.114;
};

const withDuotoneEditorControls = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name: blockName, attributes, setAttributes, clientId } = props;

		if ( ! isSupportedBlock( blockName ) ) {
			return <BlockEdit { ...props } />;
		}

		const instanceId = useInstanceId( BlockEdit );

		useEffect( () => {
			setAttributes( {
				duotoneId: `a8c-duotone-filter-${ instanceId }`,
			} );
		}, [ instanceId ] );

		const [
			defaultDarkColor = FALLBACK_DARK_COLOR,
			defaultLightColor = FALLBACK_LIGHT_COLOR,
		] = useSelect( ( select ) => {
			const { colors } = select( 'core/block-editor' ).getSettings();
			return colors
				.map( ( { color } ) => ( {
					color,
					brightness: toBrightness( color ),
				} ) )
				.reduce( ( [ min, max ], current ) => {
					return [
						! min || current.brightness < min.brightness
							? current
							: min,
						! max || current.brightness > max.brightness
							? current
							: max,
					];
				}, [] )
				.map( ( { color } ) => color );
		}, [] );

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
								onChange: ( duotoneDark ) => {
									if (
										duotoneDark &&
										! attributes.duotoneLight
									) {
										setAttributes( {
											duotoneLight:
												duotoneDark !==
												defaultLightColor
													? defaultLightColor
													: FALLBACK_LIGHT_COLOR,
										} );
									}
									setAttributes( { duotoneDark } );
								},
							},
							{
								label: __( 'Light Color', 'block-experiments' ),
								value: attributes.duotoneLight,
								onChange: ( duotoneLight ) => {
									if (
										duotoneLight &&
										! attributes.duotoneDark
									) {
										setAttributes( {
											duotoneDark:
												duotoneLight ===
												defaultDarkColor
													? defaultDarkColor
													: FALLBACK_DARK_COLOR,
										} );
									}
									setAttributes( { duotoneLight } );
								},
							},
						] }
					/>
				</InspectorControls>
				<BlockEdit { ...props } />
				{ attributes.duotoneDark &&
				attributes.duotoneLight &&
				attributes.duotoneId ? (
					<Duotone
						selector={ `#block-${ clientId } img` }
						id={ attributes.duotoneId }
						darkColor={ attributes.duotoneDark }
						lightColor={ attributes.duotoneLight }
					/>
				) : null }
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

	return { className: classnames( props.className, attributes.duotoneId ) };
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
