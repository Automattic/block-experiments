/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToolbarButton } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { rawHandler } from '@wordpress/blocks';
import { store as blockEditorStore } from '@wordpress/block-editor';

const FinaliseContentButton = ({ clientId, content }) => {
	const { replaceBlocks } = useDispatch(blockEditorStore);
	const block = useSelect(
		(select) => {
			return select(blockEditorStore).getBlock(clientId);
		},
		[clientId]
	);
	return (
		<ToolbarButton
			showTooltip
			onClick={() => replaceBlocks(block.clientId, rawHandler({ HTML: content }))}
			label={__('Convert the content to individual blocks for final formatting')}
		>
			{__('Finalise content')}
		</ToolbarButton>
	);
};

export default FinaliseContentButton;
