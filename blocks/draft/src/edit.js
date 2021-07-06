/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import FinaliseContentButton from './finalise-content';

export default function DraftEdit( {
	attributes,
	setAttributes,
	mergeBlocks,
	onReplace,
	className,
	mergedStyle,
	clientId,
} ) {
	const { content } = attributes;
	const blockProps = useBlockProps( {
		className,
		style: mergedStyle,
	} );

	return (
		<>
			<BlockControls group="block">
				<FinaliseContentButton
					clientId={ clientId }
					content={ content }
				/>
			</BlockControls>
			<section { ...blockProps }>
				<div className="draft-label">
					{ __( 'Draft content: only visible to editors' ) }
				</div>
				<RichText
					className="draft-content"
					allowedFormats={ [
						'core/bold',
						'core/italic',
						'core/link',
						'core/superscript',
						'core/subscript',
						'core/strikethrough',
						'core/text-color',
					] }
					identifier="value"
					multiline
					value={ content }
					onChange={ ( nextValue ) =>
						setAttributes( {
							content: nextValue,
						} )
					}
					onMerge={ mergeBlocks }
					aria-label={ __( 'Start drafting' ) }
					placeholder={ __( 'Start drafting' ) }
					onReplace={ onReplace }
					__unstableOnSplitMiddle={ () =>
						createBlock( 'core/paragraph' )
					}
				/>
			</section>
		</>
	);
}
