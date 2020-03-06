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

const Forms = ( { className, attributes } ) => {
	return (
		<div className={ classnames( className, 'forms' ) }>
			<Icon.FormTriangle fill={ attributes.fill1Color } style={ { height: attributes.height } } />
			<Icon.FormSquare fill={ attributes.fill2Color } style={ { height: attributes.height } } />
			<Icon.FormCircle fill={ attributes.fill3Color } style={ { height: attributes.height } } />
		</div>
	);
};

const Content = Forms;

export default Object.assign( Forms, {
	label: __( 'Forms', 'bauhaus-centenary' ),
	icon: <Icon.FormsIcon />,
	preview: <Icon.FormsPreview />,
	Content,
} );
