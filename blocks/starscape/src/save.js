/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { RichText, getColorClassName } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Starscape from './starscape';

const Save = ( { attributes, className } ) => {
	const textColorClass = getColorClassName( 'color', attributes.textColor );

	return (
		<Starscape
			className={ className }
			starStyles={ attributes.starStyles }
			animationStyles={ attributes.animationStyles }
			background={ attributes.background }
		>
			<RichText.Content
				tagName="div"
				className={ classnames(
					'wp-block-a8c-starscape__heading',
					{ [ `align${ attributes.align }` ]: attributes.align },
					{
						[ `has-text-align-${ attributes.textAlign }` ]: attributes.textAlign,
					},
					textColorClass
				) }
				style={ {
					color: textColorClass
						? undefined
						: attributes.customTextColor,
				} }
				value={ attributes.heading }
			/>
		</Starscape>
	);
};

export default Save;
