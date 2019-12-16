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

	if ( attributes.align === 'full' ) {
		return (
			<div className="ribbon is-full" { ...props }>
				<Icon.RibbonFullLeft />
				<Icon.RibbonFullCenter />
				<Icon.RibbonFullRight />
			</div>
		);
	}

	return (
		<div className="ribbon" { ...props }>
			<Icon.RibbonLeft />
			<Icon.RibbonRight />
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
