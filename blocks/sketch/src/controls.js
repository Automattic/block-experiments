/**
 * Internal dependencies
 */
import { ColorControlIcon, BrushSizeControlIcon, BrushSizeIcon } from './icons';
/**
 * WordPress dependencies
 */
{
	/* eslint-disable @wordpress/no-unsafe-wp-apis */
}
import {
	BlockControls,
	__experimentalUseEditorFeature as useEditorFeature,
} from '@wordpress/block-editor';
{
	/* eslint-enable @wordpress/no-unsafe-wp-apis */
}
import {
	ColorPalette,
	Icon,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { trash } from '@wordpress/icons';

const brushPresetChoices = [
	{
		value: 0,
		icon: <Icon icon={ <BrushSizeIcon radius="4" /> } type="svg" />,
	},
	{
		value: 1,
		icon: <Icon icon={ <BrushSizeIcon radius="6" /> } type="svg" />,
	},
	{
		value: 2,
		icon: <Icon icon={ <BrushSizeIcon radius="8" /> } type="svg" />,
	},
];

const Controls = ( { clear, color, setColor, preset, setPreset } ) => {
	const colors = useEditorFeature( 'color.palette' ) || [];
	return (
		<BlockControls group="block">
			<>
				<ToolbarGroup
					isCollapsed={ true }
					icon={ <Icon icon={ BrushSizeControlIcon } /> }
					popoverProps={ {
						className: 'wp-block-a8c-sketch__brush-style-popover',
					} }
					label={ __( 'Brush style', 'sketch' ) }
					controls={ brushPresetChoices.map( ( control ) => ( {
						...control,
						isActive: control.value === preset,
						onClick: () => {
							if ( control.value !== preset ) {
								setPreset( control.value );
							}
						},
					} ) ) }
				></ToolbarGroup>
				<ToolbarGroup
					isCollapsed={ true }
					icon={
						<Icon icon={ <ColorControlIcon color={ color } /> } />
					}
					label={ __( 'Color', 'sketch' ) }
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
				</ToolbarGroup>
				<ToolbarButton
					className="wp-block-a8c-sketch__temporary-trash-icon"
					icon={ trash }
					onClick={ clear }
				></ToolbarButton>
			</>
		</BlockControls>
	);
};
export default Controls;
