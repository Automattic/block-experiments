/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { InnerBlocks, RichText, getColorClassName } from '@wordpress/block-editor';
import { __experimentalGetSettings, dateI18n } from '@wordpress/date';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import DateSelect from './date-select';

const Save = ( { attributes } ) => {
	const settings = __experimentalGetSettings();

	const style = {
		color: attributes.customTextColor,
		backgroundColor: attributes.customBackgroundColor,
	};
	const classNames = [
		getColorClassName( 'color', attributes.textColor ),
		getColorClassName( 'background-color', attributes.backgroundColor ),
	];

	return (
		<div className={ classnames( 'wp-block-a8c-event', classNames ) } style={ style } >
			<div className="event__details">
				{ attributes.eventStart && (
					<div className="event__datebox">
						<span>{ dateI18n( 'M', attributes.eventStart ) }</span>
						<span>{ dateI18n( 'j', attributes.eventStart ) }</span>
					</div>
				) }
				<RichText.Content
					tagName="h3"
					className="event__title"
					value={ attributes.eventTitle }
				/>
				{ attributes.eventStart && (
					<div className="event__time">
						<span className="event__label">{ __( 'When:' ) }</span>
						<DateSelect.Content
							className="event__date-select"
							dateFormat={ settings.formats.datetimeAbbreviated }
							value={ attributes.eventStart }
						/>
					</div>
				) }
				{ attributes.eventLocation && (
					<div className="event__location">
						<span className="event__label">{ __( 'Where:' ) }</span>
						<RichText.Content value={ attributes.eventLocation } />
					</div>
				) }
				<InnerBlocks.Content className="event__description" />
			</div>
			{ attributes.eventImage && (
				<div className="event__image event__image--save">
					<img
						src={ attributes.eventImage }
						alt={ attributes.eventImageAlt }
					/>
				</div>
			) }
		</div>
	);
};

export default Save;
