/**
 * External dependencies
 */
import { useState } from 'react';
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
	PanelColorSettings,
	RichText,
	withColors,
} from '@wordpress/block-editor';
import { Toolbar, IconButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { __experimentalGetSettings, dateI18n } from '@wordpress/date';

/**
 * Internal dependencies
 */
import DateSelect from './date-select';
import { EditImageIcon } from './icons';

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
	const [ isEditing, setIsEditing ] = useState( false );
	const style = {
		color: textColor.color,
		backgroundColor: backgroundColor.color,
	};
	const classNames = [
		textColor.class,
		backgroundColor.class,
	];

	return (
		<>
			<BlockControls>
				{ attributes.eventImage && (
					<Toolbar>
						<IconButton
							label={ __( 'Edit image' ) }
							icon={ <EditImageIcon /> }
							onClick={ () => setIsEditing( true ) }
						/>
					</Toolbar>
				) }
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
					className={ classnames(
						'event__details',
						{ 'has-custom-color': textColor.color }
					) }
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
						onChange={ ( eventTitle ) => setAttributes( { eventTitle } ) }
						placeholder={ __( 'Event Title' ) }
					/>
					<div className="event__time">
						<span className="event__label">{ __( 'When:' ) }</span>
						{ attributes.eventStart && ! isSelected ? (
							<DateSelect.Content
								className="event__date-select"
								dateFormat={ settings.formats.datetimeAbbreviated }
								value={ attributes.eventStart }
							/>
						) : (
							<DateSelect
								className="event__date-select"
								dateFormat={ settings.formats.datetimeAbbreviated }
								value={ attributes.eventStart }
								onChange={ ( eventStart ) => setAttributes( { eventStart } ) }
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
							onChange={ ( eventLocation ) => setAttributes( { eventLocation } ) }
							placeholder={ __( 'Event Location' ) }
						/>
					</div>
					<div className="event__description">
						<InnerBlocks
							template={ [
								[ 'core/paragraph', { placeholder: 'Event Description' } ],
							] }
						/>
					</div>
				</div>
				{ attributes.eventImage && ! isEditing ? (
					<div className="event__image event__image--save">
						<img
							src={ attributes.eventImage }
							alt={ attributes.eventImageAlt }
						/>
					</div>
				) : (
					<div className="event__image">
						<MediaPlaceholder
							labels={ { title: __( 'Event Image' ) } }
							allowedTypes={ [ 'image' ] }
							multiple={ false }
							mediaPreview={ isEditing && (
								<img
									src={ attributes.eventImage }
									alt={ attributes.eventImageAlt }
								/>
							) }
							onSelect={ ( { url, alt } ) => {
								setAttributes( {
									eventImage: url,
									eventImageAlt: alt,
								} );
								setIsEditing( false );
							} }
							onSelectURL={ ( eventImage ) => {
								setAttributes( { eventImage } );
								setIsEditing( false );
							} }
							onCancel={ attributes.eventImage && ( () => {
								setIsEditing( false );
							} ) }
						/>
					</div>
				) }
			</div>
		</>
	);
};

export default withColors( 'backgroundColor', 'textColor' )( Edit );
