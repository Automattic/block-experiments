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
import { __ } from '@wordpress/i18n';
import { __experimentalGetSettings, dateI18n } from '@wordpress/date';

/**
 * Internal dependencies
 */
import DateSelect from './date-select';
import { EditImageIcon } from './icons';

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
	const style = {
		color: textColor.color,
		backgroundColor: backgroundColor.color,
	};
	const classNames = [ textColor.class, backgroundColor.class ];
	const onSelectMedia = ( media ) => {
		setAttributes( {
			eventImageId: media.id,
			eventImageURL: media.url,
			eventImageAlt: media.alt,
		} );
	};

	return (
		<>
			<BlockControls>
				<MediaReplaceFlow
					mediaId={ attributes.eventImageId }
					mediaURL={ attributes.eventImageURL }
					allowedTypes={ ALLOWED_MEDIA_TYPES }
					accept={ ACCEPT_MEDIA_TYPES }
					onSelect={ onSelectMedia }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelColorSettings
					title={ __( 'Color Settings' ) }
					initialOpen
					colorSettings={ [
						{
							value: backgroundColor.color,
							onChange: setBackgroundColor,
							label: __( 'Background Color' ),
						},
						{
							value: textColor.color,
							onChange: setTextColor,
							label: __( 'Text Color' ),
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
						placeholder={ __( 'Event Title' ) }
					/>
					<div className="event__time">
						<span className="event__label">{ __( 'When:' ) }</span>
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
								placeholder={ __( 'Choose a Date' ) }
							/>
						) }
					</div>
					<div className="event__location">
						<span className="event__label">{ __( 'Where:' ) }</span>
						<RichText
							value={ attributes.eventLocation }
							multiline="false"
							keepPlaceholderOnFocus
							onChange={ ( eventLocation ) =>
								setAttributes( { eventLocation } )
							}
							placeholder={ __( 'Event Location' ) }
						/>
					</div>
					<div className="event__description">
						<InnerBlocks
							template={ [
								[
									'core/paragraph',
									{ placeholder: 'Event Description' },
								],
							] }
						/>
					</div>
				</div>
				{ attributes.eventImageURL ? (
					<div className="event__image event__image--save">
						<img
							src={ attributes.eventImageURL }
							alt={ attributes.eventImageAlt }
						/>
					</div>
				) : (
					<div className="event__image">
						<MediaPlaceholder
							labels={ { title: __( 'Event Image' ) } }
							allowedTypes={ ALLOWED_MEDIA_TYPES }
							accept={ ACCEPT_MEDIA_TYPES }
							onSelect={ onSelectMedia }
							onSelectURL={ ( eventImageURL ) => {
								setAttributes( { eventImageURL } );
							} }
						/>
					</div>
				) }
			</div>
		</>
	);
};

export default withColors( 'backgroundColor', 'textColor' )( Edit );
