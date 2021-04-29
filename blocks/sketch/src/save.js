/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

const Save = () => {
	const blockProps = useBlockProps.save();

	return (
		<figure { ...blockProps }>
			{ __( 'Sketch drawing', 'p2-blocks' ) }
		</figure>
	);
};

export default Save;
