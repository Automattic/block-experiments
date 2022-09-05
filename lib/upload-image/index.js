/**
 * WordPress dependencies
 */
import { store as blockEditorStore } from '@wordpress/block-editor';
import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default function uploadBlobToMediaLibrary(
	imageBlob,
		{
			title = __( 'Image generated via Sketch block', 'a8c-sketch' ),
			caption = '',
			description = '',
		},
	fn
) {
	const { getSettings } = select( blockEditorStore );
	const mediaUpload = getSettings().mediaUpload;

	if ( ! imageBlob ) {
		return fn( __( 'No valid image', 'a8c-sketch' ) );
	}

	const reader = new window.FileReader();
	reader.readAsDataURL( imageBlob );
	reader.onloadend = () => {
		mediaUpload( {
			additionalData: {
				title,
				caption,
				description,
			},
			allowedTypes: [ 'image' ],
			filesList: [ imageBlob ],
			onFileChange: ( images ) => {
				if ( ! images?.length ) {
					return;
				}

				const image = images[ 0 ];
				if ( ! image?.id ) {
					return;
				}
				fn( null, image );
			},
			onError: fn,
		} );
	};
}