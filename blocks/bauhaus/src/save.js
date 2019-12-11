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
import categories from './categories';

const Save = ( { attributes, className } ) => {
	const Category = categories[ attributes.category ];

	const style = {
		color: attributes.customTextColor,
		backgroundColor: attributes.customBackgroundColor,
	};

	const classNames = classnames(
		className,
		{ [ `align${ attributes.align }` ]: attributes.align },
		getColorClassName( 'fill-color', attributes.fillColor ),
		getColorClassName( 'background-color', attributes.backgroundColor ),
	);

	return (
		<figure className={ classNames } style={ style }>
			<Category.Content attributes={ attributes } />
			{ ! RichText.isEmpty( attributes.caption ) && <RichText.Content tagName="figcaption" value={ attributes.caption } /> }
		</figure>
	);
};

export default Save;
