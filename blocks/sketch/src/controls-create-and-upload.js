/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	TextControl,
	MenuGroup,
	Notice,
	DropdownMenu,
} from '@wordpress/components';
import { upload } from '@wordpress/icons';
import {
	useState,
	useEffect,
	useRef,
	Fragment,
	createInterpolateElement,
} from '@wordpress/element';
import convertFormatBytes from '../../../lib/bites-unit-converter';

export function CreateAndUploadDropdown( {
	toggleProps,
	onCreateAndUpload,
	blockRef,
} ) {
	const [ size, setSize ] = useState( 100 );
	const [ exportSize, setExportSize ] = useState();

	const isInvalidSize = ! size || size < 10;

	function getCanvasElement() {
		if ( ! blockRef.current ) {
			return;
		}

		return blockRef.current.querySelector( 'canvas' );
	}

	useEffect( () => {
		const canvasElement = getCanvasElement();
		if ( ! canvasElement ) {
			return;
		}

		canvasElement.toBlob( ( imageBlob ) => {
			if ( ! imageBlob ) {
				return setExportSize( null );
			}

			setExportSize( convertFormatBytes( imageBlob.size ) );
		} );

	}, [ blockRef, setExportSize ] );

	return (
		<Fragment>
			<DropdownMenu
				icon={ upload }
				popoverProps={ {
					position: 'bottom right',
					isAlternate: true,
				} }
				toggleProps={ toggleProps }
				label={ __( 'Upload to Media Library', 'a8c-sketch' ) }
			>
				{ ( { onClose } ) => (
					<MenuGroup className="wp-block-a8c-sketch__toolbar-menu-group">
						<TextControl
							type="number"
							label={ __( 'Image width', 'a8c-sketch' ) }
							value={ size }
							min={ 1 }
							onChange={ setSize }
							help={ __( 'The image height will be defined proportionally based on the sketch block dims.', 'a8c-sketch' ) }
						/>
						{ ( ! isInvalidSize && exportSize ) && (
							<Fragment>
								<p>
									{ createInterpolateElement(
										sprintf(
											/* translators: 1: Image size, e.g. 200 */
											'Image size: <strong>%1$spx</strong> x <strong>%1$spx</strong>.',
											size
										),
										{
											strong: (
												<strong />
											),
										}
									) }
									<br />
									{ createInterpolateElement(
										sprintf(
											/* translators: Image weigth, e.g. 3Kb. */
											'Image Weigth: <strong>%s</strong>.',
											exportSize
										),
										{
											strong: (
												<strong />
											),
										}	
									) }
								</p>
							</Fragment>
						) }

						{ ! exportSize && (
							<Notice
								spokenMessage={ null }
								status="warning"
								isDismissible={ false }
							>
								{ __( 'Wrong image size.', 'a8c-sketch' ) }
							</Notice>
						) }

						<div className="wp-block-a8c-sketch__actions">
							<Button
								variant="primary"
								disabled={ isInvalidSize }
								onClick={ () => {
									const el = getCanvasElement();
									el.toBlob( onCreateAndUpload );
									onClose();
								} }
							>
								{ __( 'Create & Upload', 'a8c-sketch' ) }
							</Button>

							<Button
								variant="tertiary"
								onClick={ onClose }
							>
								{ __( 'Cancel', 'a8c-sketch' ) }
							</Button>
						</div>
					</MenuGroup>
				) }
			</DropdownMenu>
		</Fragment>
	);
}
