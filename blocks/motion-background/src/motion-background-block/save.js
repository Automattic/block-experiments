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
import MotionBackground from './motion-background';

const Save = ( { attributes, className } ) => {
	const textColorClass = getColorClassName( 'color', attributes.textColor );

	return (
		<MotionBackground className={ className } attributes={ attributes } >
			<RichText.Content
				tagName="div"
				className={ classnames(
					'wp-block-a8c-motion-background__heading',
					{ [ `align${ attributes.align }` ]: attributes.align },
					{ [ `has-text-align-${ attributes.textAlign }` ]: attributes.textAlign },
					textColorClass
				) }
				style={ { color: textColorClass ? undefined : attributes.customTextColor } }
				value={ attributes.heading }
			/>
		</MotionBackground>
	);
};

export default Save;
