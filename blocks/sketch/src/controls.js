/**
 * WordPress dependencies
 */
import { BlockControls, InspectorControls, useSetting } from '@wordpress/block-editor';
import { useDispatch } from '@wordpress/data';
import {
	ColorPalette,
	Icon,
	PanelBody,
	TextareaControl,
	ToolbarButton,
	ToolbarDropdownMenu,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { trash, upload } from '@wordpress/icons';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import uploadBlobToMediaLibrary from '../../../lib/upload-image';
import svgDomToBlob from '../../../lib/svg-dom-to-blob';
import { ColorControlIcon, BrushSizeControlIcon, BrushSizeIcon } from './icons';

const brushes = [
	{
		value: 0,
		icon: <Icon icon={ <BrushSizeIcon radius="2" /> } type="svg" />,
	},
	{
		value: 1,
		icon: <Icon icon={ <BrushSizeIcon radius="4" /> } type="svg" />,
	},
	{
		value: 2,
		icon: <Icon icon={ <BrushSizeIcon radius="7" /> } type="svg" />,
	},
];

const Controls = ( {
	clear,
	color,
	setColor,
	preset,
	setPreset,
	isEmpty,
	title,
	setTitle,
	blockRef,
	attributes,
} ) => {
	const colors = useSetting( 'color.palette' ) || [];
	const { createErrorNotice, createInfoNotice } = useDispatch( noticesStore );
	function getSVGNodeElement() {
		if ( ! blockRef.current ) {
			return;
		}

		return blockRef.current.querySelector( 'svg' );
	}

	return (
		<>
			<BlockControls group="block">
				<ToolbarDropdownMenu
					isCollapsed
					popoverProps={ {
						className: 'wp-block-a8c-sketch__brush-style-popover',
						isAlternate: true,
					} }
					icon={ <Icon icon={ BrushSizeControlIcon } /> }
					label={ __( 'Brush', 'a8c-sketch' ) }
					controls={ brushes.map( ( control ) => ( {
						...control,
						isActive: control.value === preset,
						onClick: () => {
							if ( control.value !== preset ) {
								setPreset( control.value );
							}
						},
					} ) ) }
				/>
				<ToolbarDropdownMenu
					isCollapsed
					popoverProps={ { isAlternate: true } }
					icon={
						<Icon icon={ <ColorControlIcon color={ color } /> } />
					}
					label={ __( 'Color', 'a8c-sketch' ) }
				>
					{ () => (
						<ColorPalette
							clearable={ false }
							colors={ colors }
							color={ color }
							disableCustomColors={ true }
							onChange={ setColor }
						/>
					) }
				</ToolbarDropdownMenu>
				<ToolbarButton
					icon={ trash }
					onClick={ clear }
					label={ __( 'Clear canvas', 'a8c-sketch' ) }
					disabled={ isEmpty }
				/>

				<ToolbarButton
					icon={ upload }
					disabled={ isEmpty }
					onClick={ () => {
						svgDomToBlob( getSVGNodeElement(), function( blob ) {
							uploadBlobToMediaLibrary( blob, { description: attributes?.title }, function( err, image ) {
								if ( err ) {
									return createErrorNotice( err );
								}

								createInfoNotice(
									sprintf(
										__( 'Image created and added to the library', 'a8c-sketch' ),
										image.id,
									),
									{
										id: `uploaded-image-${ image.id }`,
										type: 'snackbar',
										isDismissible: false,
										actions: [
											{
												url: `/wp-admin/upload.php?item=${ image.id }`, // @ToDo - Get the rute properly
												label: __( 'View Image', 'a8c-sketch' ),
											},
										],
									}
								);
							} );
						} );
					} }
					label={ __( 'Upload', 'a8c-sketch' ) }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'a8c-sketch' ) }>
					<TextareaControl
						label={ __( 'a8c-sketch' ) }
						value={ title }
						onChange={ setTitle }
						help={
							<>
								{ __(
									"Add a short-text description so it's recognized as the accessible name for the sketch.",
									'a8c-sketch'
								) }
							</>
						}
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
};

export default Controls;
