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

const Ribbon = ( { attributes } ) => {
	const isFullWidth = attributes.align === 'full';
	const RibbonVariation = isFullWidth ?
		Icon.RibbonFull :
		Icon.RibbonCentered;
	return (
		<RibbonVariation
			// height={ attributes.height }
			style={ { height: attributes.height } }
			preserveAspectRatio={ isFullWidth ? 'none' : 'xMidYMid' }
			className={ classnames( 'ribbon', { 'is-full': isFullWidth } ) }
		/>
	);
};

const Content = Ribbon;

export default Object.assign( Ribbon, {
	label: __( 'Ribbon' ),
	icon: <Icon.RibbonIcon />,
	preview: <Icon.RibbonPreview />,
	Content,
} );
