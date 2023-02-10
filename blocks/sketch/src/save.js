/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

const Save = ( { attributes } ) => {
	const blockProps = useBlockProps.save();

	const strokes = attributes.strokes ?? [];
	const height  = attributes.height ?? 450;

	const align = attributes.align ? ` align${ attributes.align }` : '';
	const title = attributes.title ? `<title>${ attributes.title }</title>` : '';

	if ( ! attributes.strokes || '' === attributes.strokes ) {
		return <figure { ...blockProps }></figure>;
	}

	const paths = strokes.map( ( stroke ) => {
		if ( ! stroke.stroke || '' === stroke.stroke || ! stroke.color || '' === stroke.color ) {
			return '';
		}

		return <path fill={ stroke.color } d={ getSvgPathFromStroke( stroke.stroke ) } />;
	} );

	return (
		<figure { ...blockProps }>
			<svg role="img" >
				{ title }
				{ paths }
			</svg>
		</figure>
	);
};

const getSvgPathFromStroke = function( stroke ) {
	if ( stroke.length === 0 ) {
		return '';
	}

	const d = [];

	let p0 = stroke[ 0 ];
	let p1 = stroke[ 1 ];

	d.push( 'M', p0[ 0 ], p0[ 1 ], 'Q' );

	const nMarks = stroke.length;

	for ( let i = 1; i < nMarks; i++ ) {

		d.push(
			p0[ 0 ],
			p0[ 1 ],
			( p0[ 0 ] + p1[ 0 ] ) / 2,
			( p0[ 1 ] + p1[ 1 ] ) / 2
		);
		p0 = p1;
		p1 = stroke[ i ];
	}

	d.push( 'Z' );

	return d.join( ' ' );
};

export default Save;
