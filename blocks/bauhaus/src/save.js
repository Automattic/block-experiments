/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Forms from './forms';
import Year from './year';
import Ribbon from './ribbon';

const Bauhaus = ( { attributes } ) => {
	switch ( attributes.category ) {
		case 'forms':
			return <Forms size={ attributes.formsSize } />;
		case 'year':
			return <Year display={ attributes.yearDisplay } />;
		case 'ribbon':
			return <Ribbon size={ attributes.ribbonSize } />;
		default:
			return null;
	}
};

const Save = ( { attributes, className } ) => {
	const classes = classnames( className, {
		[ `align${ attributes.align }` ]: attributes.align,
		[ `size-${ attributes.sizeSlug }` ]: attributes.sizeSlug,
		'is-resized': attributes.width || attributes.height,
	} );

	return (
		<figure className={ classes }>
			<Bauhaus attributes={ attributes } />
			{ ! RichText.isEmpty( attributes.caption ) && <RichText.Content tagName="figcaption" value={ attributes.caption } /> }
		</figure>
	);
};

export default Save;
