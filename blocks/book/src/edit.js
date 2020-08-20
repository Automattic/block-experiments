import {
	BlockControls,
	MediaPlaceholder,
	MediaUpload,
	RichText,
	__experimentalBlock as Block,
} from '@wordpress/block-editor';
import { Button, ResizableBox, Toolbar } from '@wordpress/components';
/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { isEmpty } from 'lodash';

import classnames from 'classnames';
import prefixClasses from './prefixClasses';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @param {Object} [props]           Properties passed from the editor.
 * @param {string} [props.className] Class name generated for the block.
 *
 * @return {WPElement} Element to render.
 */

export default function Edit( {
	className,
	isSelected,
	setAttributes,
	attributes,
} ) {
	const {
		author,
		align,
		height,
		imageId,
		imageUrl,
		publicationDate,
		publisher,
		title,
		width,
	} = attributes;
	const hasMedia = !! imageId;

	const handleResize = ( event, direction, elt, delta ) =>
		setAttributes( {
			height: parseInt( height + delta.height, 10 ),
			width: parseInt( width + delta.width, 10 ),
		} );

	const handleSelectCoverImage = ( media ) =>
		setAttributes( { imageId: media.id, imageUrl: media.url } );

	const handleImageLoad = ( event ) => {
		const { currentTarget } = event;
		const { naturalHeight, naturalWidth } = currentTarget;

		setAttributes( { height: naturalHeight, width: naturalWidth } );
	};

	const classes = classnames( 'wp-block-a8c-book', className );

	/**
	 * Function that creates an event handler for the RichText element,
	 *  which will update the given `attribute`.
	 *
	 * @param {String} attribute
	 */
	const updateAttribute = ( attribute ) => ( value ) =>
		setAttributes( { [ attribute ]: value } );

	const enabledHandles = {
		top: false,
		right: align === 'left' || ! align || align === 'center',
		left: align === 'right' || align === 'center',
		bottom: true,
		topRight: false,
		bottomRight: false,
		bottomLeft: false,
		topLeft: false,
	};

	const resizableBoxClasses = classnames( prefixClasses( '__cover' ), {
		[ `${ prefixClasses( '__cover-placeholder' ) }` ]: ! hasMedia,
	} );

	const shouldDisplayField = ( field ) =>
		! RichText.isEmpty( field ) || isSelected;
	const shouldDisplayMetadata =
		title || author || publisher || publicationDate || isSelected;

	return (
		<Block.div className={ classes }>
			{ hasMedia && (
				<BlockControls>
					<Toolbar>
						<MediaUpload
							onSelect={ handleSelectCoverImage }
							allowedTypes={ [ 'image' ] }
							value={ imageId }
							render={ ( { open } ) => (
								<Button
									className="components-toolbar__control"
									onClick={ open }
								>
									{ __( 'Replace' ) }
								</Button>
							) }
						/>
					</Toolbar>
				</BlockControls>
			) }
			<ResizableBox
				enable={ enabledHandles }
				className={ resizableBoxClasses }
				size={ {
					height,
					width,
				} }
				defaultSize={ { width: '100%' } }
				maxWidth="100%"
				onResizeStop={ handleResize }
				showHandle={ isSelected }
				lockAspectRatio
			>
				{ hasMedia ? (
					<img
						src={ imageUrl }
						alt={ title }
						onLoad={ handleImageLoad }
					/>
				) : (
					<MediaPlaceholder
						allowedTypes={ [ 'image' ] }
						onSelect={ handleSelectCoverImage }
						labels={ {
							title: __( 'Book cover image' ),
							instructions: __(
								"Upload the book's cover image."
							),
						} }
						value={ { id: imageId } }
					/>
				) }
			</ResizableBox>

			{ shouldDisplayMetadata && (
				<section
					className={ prefixClasses( '__meta' ) }
					style={ { width } }
				>
					{ shouldDisplayField( title ) && (
						<RichText
							keepPlaceholderOnFocus
							name="title"
							tagName="p"
							value={ title }
							placeholder="Book title"
							className={ prefixClasses( '__title' ) }
							onChange={ updateAttribute( 'title' ) }
						/>
					) }
					{ shouldDisplayField( author ) && (
						<RichText
							keepPlaceholderOnFocus
							name="author"
							tagName="p"
							value={ author }
							placeholder="Author name"
							onChange={ updateAttribute( 'author' ) }
						/>
					) }
					<p className={ prefixClasses( '__publication' ) }>
						{ shouldDisplayField( publisher ) && (
							<RichText
								keepPlaceholderOnFocus
								name="publisher"
								tagName="span"
								value={ publisher }
								placeholder="Publisher"
								onChange={ updateAttribute( 'publisher' ) }
							/>
						) }
						{ shouldDisplayField( publicationDate ) && (
							<RichText
								keepPlaceholderOnFocus
								name="publicationDate"
								tagName="span"
								value={ publicationDate }
								placeholder="Publication date"
								onChange={ updateAttribute(
									'publicationDate'
								) }
							/>
						) }
					</p>
				</section>
			) }
		</Block.div>
	);
}
