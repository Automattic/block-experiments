/**
 * Internal dependencies
 */
import { ColorControlIcon, BrushSizeControlIcon, BrushSizeIcon } from './icons';
/**
 * WordPress dependencies
 */
import {
	BlockControls,
	InspectorControls,
	useSetting,
} from '@wordpress/block-editor';
import {
	ColorPalette,
	Icon,
	PanelBody,
	TextareaControl,
	ToolbarButton,
	ToolbarItem,
	ToolbarDropdownMenu,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { trash } from '@wordpress/icons';
import { CreateAndUploadDropdown } from './controls-create-and-upload';

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
} ) => {
	const colors = useSetting( 'color.palette' ) || [];
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
			</BlockControls>
			<BlockControls group="other">
				<ToolbarItem>
					{ ( toggleProps ) => (
						<CreateAndUploadDropdown
							blockRef={ blockRef }
							toggleProps={ toggleProps }
							onCreateAndUpload={ ( blob ) => {
								uploadBlobToMediaLibrary( blob, { caption: value, description: value }, function( err, image ) {
									if ( err ) {
										// removeAllNotices();
										createErrorNotice( err );
										return;
									}

									createInfoNotice(
										sprintf(
											/* translators: %s: Publish state and date of the post. */
											__( 'Image {%s} created and uploaded to the library', 'a8c-sketch' ),
											image.id,
										),
										{
											id: `uploaded-image-${ image.id }`,
											type: 'snackbar',
										}
									);
								} );
							} }	
						/>
					) }
				</ToolbarItem>
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
