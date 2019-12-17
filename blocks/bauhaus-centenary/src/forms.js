/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import * as Icon from './icon';

const forms = {
	triangle: Icon.FormTriangle,
	square: Icon.FormSquare,
	circle: Icon.FormCircle,
};

const Forms = ( { className, attributes } ) => {
	return (
		<div className={ classnames( className, 'forms' ) }>
			{ attributes.forms.map( ( form, index ) => {
				const Form = forms[ form.type ];
				return <Form key={ index } style={ { height: attributes.height } } />;
			} ) }
		</div>
	);
};

const Content = Forms;

export default Object.assign( Forms, {
	label: __( 'Forms' ),
	icon: <Icon.FormsIcon />,
	preview: <Icon.FormsPreview />,
	Content,
	// extraColors,
} );
