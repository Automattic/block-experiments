/**
 * WordPress dependencies
 */
import { Button, DateTimePicker, Dropdown } from '@wordpress/components';
import { dateI18n } from '@wordpress/date';

const DateSelect = ( {
	placeholder,
	value,
	dateFormat,
	onChange,
	className,
} ) => (
	<Dropdown
		className={ className }
		position="bottom left"
		renderToggle={ ( { onToggle, isOpen } ) => (
			<Button
				className="button"
				onClick={ onToggle }
				aria-expanded={ isOpen }
				aria-live="polite"
			>
				{ value ? dateI18n( dateFormat, value ) : placeholder }
			</Button>
		) }
		renderContent={ () => (
			<DateTimePicker currentDate={ value } onChange={ onChange } />
		) }
	/>
);

DateSelect.Content = ( { value, dateFormat, className } ) =>
	value && (
		<time className={ className } dateTime={ dateI18n( 'c', value ) }>
			{ dateI18n( dateFormat, value ) }
		</time>
	);

export default DateSelect;
