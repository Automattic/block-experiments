/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import * as Icon from './icon';

const Ribbon = ( { attributes } ) => {
	const props = {
		style: { height: attributes.height },
		role: 'img',
		'aria-hidden': true,
	};

	const iconProps = {
		fill1: attributes.fill1Color,
		fill2: attributes.fill2Color,
		fill3: attributes.fill3Color,
	};

	if ( attributes.align === 'full' ) {
		return (
			<div className="ribbon is-full" { ...props }>
				<Icon.RibbonFullLeft { ...iconProps } />
				<Icon.RibbonFullCenter { ...iconProps } />
				<Icon.RibbonFullRight { ...iconProps } />
			</div>
		);
	}

	return (
		<div className="ribbon" { ...props }>
			<Icon.RibbonLeft { ...iconProps } />
			<Icon.RibbonRight { ...iconProps } />
		</div>
	);
};

const Content = Ribbon;

export default Object.assign( Ribbon, {
	label: __( 'Ribbon' ),
	icon: <Icon.RibbonIcon />,
	preview: <Icon.RibbonPreview />,
	Content,
} );
