/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import * as Icon from './icon';
import colors from './colors';

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
				return <Form key={ index } height={ attributes.height } />;
			} ) }
		</div>
	);
};

const Content = Forms;

const labels = {
	triangle: __( 'Triangle' ),
	square: __( 'Square' ),
	circle: __( 'Circle' ),
};

const extraColors = ( { setAttributes, attributes } ) =>
	// TODO: Check to see if we need to support flatMap on IE11
	attributes.forms.flatMap( ( form, index ) => [
		{
			colors,
			value: form.fill,
			onChange: ( fill ) => setAttributes( ( prevForms ) => prevForms.splice( index, 1, { ...form, fill } ) ),
			label: sprintf( __( '%s Fill [%d]' ), labels[ form.type ], index + 1 ),
		},
		{
			colors,
			value: form.stroke,
			onChange: ( stroke ) => setAttributes( ( prevForms ) => prevForms.splice( index, 1, { ...form, stroke } ) ),
			label: sprintf( __( '%s Stroke [%d]' ), labels[ form.type ], index + 1 ),
		},
	] );

export default Object.assign( Forms, {
	label: __( 'Forms' ),
	icon: <Icon.FormsIcon />,
	preview: <Icon.FormsPreview />,
	Content,
	// extraColors,
} );
