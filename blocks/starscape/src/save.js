/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Starscape from './starscape';
import { genStars, genAnimations } from './utils';

function StarscapeSave( { attributes } ) {
	const {
		background,
		color,
		intensity,
		density,
		speed,
		minHeight,
		areaWidth,
		areaHeight,
		tagName,
	} = attributes;

	const starStyles = genStars( { color, density, areaWidth, areaHeight } );
	const animationStyles = genAnimations( { speed } );

	const blockProps = useBlockProps.save( {
		style: { background, minHeight },
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'wp-block-a8c-starscape__inner',
	} );

	return (
		<Starscape
			as={ tagName }
			starStyles={ starStyles }
			animationStyles={ animationStyles }
			intensity={ intensity }
			{ ...blockProps }
		>
			<div { ...innerBlocksProps } />
		</Starscape>
	);
}

export default StarscapeSave;
