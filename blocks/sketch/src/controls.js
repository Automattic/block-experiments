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
	ExternalLink,
	Icon,
	PanelBody,
	TextareaControl,
	ToolbarButton,
	ToolbarDropdownMenu,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { trash } from '@wordpress/icons';

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
					label={ __( 'Brush', 'sketch' ) }
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
				</ToolbarDropdownMenu>
				<ToolbarButton
					icon={ trash }
					onClick={ clear }
					label={ __( 'Clear canvas', 'sketch' ) }
					disabled={ isEmpty }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) }>
					<TextareaControl
						label={ __( 'Title' ) }
						value={ title }
						onChange={ setTitle }
						help={
							<>
								<ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title">
									{ __(
										'Short-text description of the sketch drawing'
									) }
								</ExternalLink>
							</>
						}
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
};
export default Controls;
