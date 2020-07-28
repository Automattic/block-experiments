/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	BlockControls,
	ContrastChecker,
	InnerBlocks,
	InspectorControls,
	MediaPlaceholder,
	MediaReplaceFlow,
	PanelColorSettings,
	RichText,
	withColors,
} from '@wordpress/block-editor';
import {
	FocalPointPicker,
	PanelBody,
	PanelRow,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { __experimentalGetSettings, dateI18n } from '@wordpress/date';

/**
 * Internal dependencies
 */
import DateSelect from './date-select';

const ALLOWED_MEDIA_TYPES = [ 'image' ];
const ACCEPT_MEDIA_TYPES = 'image/*';

const Edit = ( {
	attributes,
	setAttributes,
	textColor,
	setTextColor,
	backgroundColor,
	setBackgroundColor,
	isSelected,
} ) => {
	const settings = __experimentalGetSettings();

	const classNames = [ textColor.class, backgroundColor.class ];
	const style = {
		color: textColor.color,
		backgroundColor: backgroundColor.color,
	};
	const imgStyle = {
		backgroundImage:
			attributes.eventImageURL && `url(${ attributes.eventImageURL })`,
		backgroundPosition:
			attributes.focalPoint &&
			`${ attributes.focalPoint.x * 100 }% ${
				attributes.focalPoint.y * 100
			}%`,
		backgroundSize: 'cover',
	};

	const onSelectImage = ( media ) => {
		setAttributes( {
			eventImageId: media.id,
			eventImageURL: media.url,
			eventImageAlt: media.alt,
		} );
	};
	const onSelectImageURL = ( eventImageURL ) => {
		setAttributes( { eventImageURL } );
	};

	return (
		<>
			<BlockControls>
				<MediaReplaceFlow
					mediaId={ attributes.eventImageId }
					mediaURL={ attributes.eventImageURL }
					allowedTypes={ ALLOWED_MEDIA_TYPES }
					accept={ ACCEPT_MEDIA_TYPES }
					onSelect={ onSelectImage }
					onSelectURL={ onSelectImageURL }
				/>
			</BlockControls>
			<InspectorControls>
				{ attributes.eventImageURL && (
					<PanelBody title={ __( 'Media settings', 'event' ) }>
						<FocalPointPicker
							label={ __( 'Focal point picker', 'event' ) }
							url={ attributes.eventImageURL }
							value={ attributes.focalPoint }
							onChange={ ( focalPoint ) =>
								setAttributes( { focalPoint } )
							}
						/>
						<PanelRow>
							<Button
								isSecondary
								isSmall
								onClick={ () =>
									setAttributes( {
										eventImageURL: undefined,
										eventImageId: undefined,
										eventImageAlt: undefined,
										focalPoint: undefined,
									} )
								}
							>
								{ __( 'Clear Media', 'event' ) }
							</Button>
						</PanelRow>
					</PanelBody>
				) }
				<PanelColorSettings
					title={ __( 'Color Settings', 'event' ) }
					initialOpen
					colorSettings={ [
						{
							value: backgroundColor.color,
							onChange: setBackgroundColor,
							label: __( 'Background Color', 'event' ),
						},
						{
							value: textColor.color,
							onChange: setTextColor,
							label: __( 'Text Color', 'event' ),
						},
					] }
				>
					<ContrastChecker
						textColor={ textColor.color }
						backgroundColor={ backgroundColor.color }
					/>
				</PanelColorSettings>
			</InspectorControls>
			<div
				className={ classnames( 'wp-block-a8c-event', classNames ) }
				style={ style }
			>
				<div
					className={ classnames( 'event__details', {
						'has-custom-color': textColor.color,
					} ) }
				>
					<div className="event__datebox">
						<span>{ dateI18n( 'M', attributes.eventStart ) }</span>
						<span>{ dateI18n( 'j', attributes.eventStart ) }</span>
					</div>
					<RichText
						tagName="h3"
						className="event__title"
						value={ attributes.eventTitle }
						keepPlaceholderOnFocus
						onChange={ ( eventTitle ) =>
							setAttributes( { eventTitle } )
						}
						placeholder={ __( 'Event Title', 'event' ) }
					/>
					<div className="event__time">
						<span className="event__label">
							{ __( 'When:', 'event' ) }
						</span>
						{ attributes.eventStart && ! isSelected ? (
							<DateSelect.Content
								className="event__date-select"
								dateFormat={
									settings.formats.datetimeAbbreviated
								}
								value={ attributes.eventStart }
							/>
						) : (
							<DateSelect
								className="event__date-select"
								dateFormat={
									settings.formats.datetimeAbbreviated
								}
								value={ attributes.eventStart }
								onChange={ ( eventStart ) =>
									setAttributes( { eventStart } )
								}
								placeholder={ __( 'Choose a Date', 'event' ) }
							/>
						) }
					</div>
					<div className="event__location">
						<span className="event__label">
							{ __( 'Where:', 'event' ) }
						</span>
						<RichText
							value={ attributes.eventLocation }
							multiline="false"
							keepPlaceholderOnFocus
							onChange={ ( eventLocation ) =>
								setAttributes( { eventLocation } )
							}
							placeholder={ __( 'Event Location', 'event' ) }
						/>
					</div>
					<div className="event__description">
						<InnerBlocks
							template={ [
								[
									'core/paragraph',
									{
										placeholder: __(
											'Event Description',
											'event'
										),
									},
								],
							] }
						/>
					</div>
				</div>
				{ attributes.eventImageURL ? (
					<div
						role="img"
						aria-label={ attributes.eventImageAlt }
						className="event__image event__image--save"
						style={ imgStyle }
					/>
				) : (
					<div className="event__image">
						<MediaPlaceholder
							labels={ { title: __( 'Event Image', 'event' ) } }
							allowedTypes={ ALLOWED_MEDIA_TYPES }
							accept={ ACCEPT_MEDIA_TYPES }
							onSelect={ onSelectImage }
							onSelectURL={ onSelectImageURL }
						/>
					</div>
				) }
			</div>
		</>
	);
};

export default withColors( 'backgroundColor', 'textColor' )( Edit );
