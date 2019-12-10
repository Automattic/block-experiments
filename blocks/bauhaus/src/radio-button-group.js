/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';

const RadioButtonGroup = ( { options, selected, onChange, className } ) => (
	<div
		// Borrowing just the styling from ButtonGroup so the role can be radiogroup
		// `role` doesn't get overridden when using the ButtonGroup component
		className={ classnames(
			'components-button-group',
			'is-radio-group',
			className
		) }
		role="radiogroup"
	>
		{ options.map( ( { label, value } ) => (
			<Button
				key={ value }
				role="radio"
				aria-checked={ selected === value }
				isPrimary={ selected === value }
				isDefault={ selected !== value }
				onClick={ () => onChange( value ) }
			>
				{ label }
			</Button>
		) ) }
	</div>
);

export default RadioButtonGroup;
