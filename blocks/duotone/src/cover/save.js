/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	InnerBlocks,
	getColorClassName,
	__experimentalGetGradientClass,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import {
	IMAGE_BACKGROUND_TYPE,
	VIDEO_BACKGROUND_TYPE,
	dimRatioToClass,
	isContentPositionCenter,
	getPositionClassName,
} from './shared';

export default function save( { attributes } ) {
	const {
		backgroundType,
		gradient,
		contentPosition,
		customGradient,
		customOverlayColor,
		dimRatio,
		focalPoint,
		hasParallax,
		overlayColor,
		url,
		minHeight: minHeightProp,
		minHeightUnit,
	} = attributes;
	const overlayColorClass = getColorClassName(
		'background-color',
		overlayColor
	);
	const gradientClass = __experimentalGetGradientClass( gradient );
	const minHeight = minHeightUnit
		? `${ minHeightProp }${ minHeightUnit }`
		: minHeightProp;

	const isImageBackground = IMAGE_BACKGROUND_TYPE === backgroundType;
	const isVideoBackground = VIDEO_BACKGROUND_TYPE === backgroundType;

	const style = {};
	const videoStyle = {};
	const imageStyle = {};

	if ( ! overlayColorClass ) {
		style.backgroundColor = customOverlayColor;
	}

	if ( customGradient && ! url ) {
		style.background = customGradient;
	}
	style.minHeight = minHeight || undefined;

	let positionValue;

	if ( focalPoint ) {
		positionValue = `${ Math.round( focalPoint.x * 100 ) }% ${ Math.round(
			focalPoint.y * 100
		) }%`;

		if ( isImageBackground ) {
			imageStyle.objectPosition = positionValue;
			imageStyle.filter = `url( #${ attributes.duotoneId } )`;
		}

		if ( isVideoBackground ) {
			videoStyle.objectPosition = positionValue;
			videoStyle.filter = `url( #${ attributes.duotoneId } )`;
		}
	}

	const classes = classnames(
		dimRatioToClass( dimRatio ),
		overlayColorClass,
		{
			'has-background-dim': dimRatio !== 0,
			'has-parallax': hasParallax,
			'has-background-gradient': gradient || customGradient,
			[ gradientClass ]: ! url && gradientClass,
			'has-custom-content-position': ! isContentPositionCenter(
				contentPosition
			),
		},
		getPositionClassName( contentPosition )
	);

	return (
		<div className={ classes } style={ style }>
			{ url && ( gradient || customGradient ) && dimRatio !== 0 && (
				<span
					aria-hidden="true"
					className={ classnames(
						'wp-block-a8c-duotone-cover__gradient-background',
						gradientClass
					) }
					style={
						customGradient
							? { background: customGradient }
							: undefined
					}
				/>
			) }
			{ isImageBackground && url && (
				<img
					className="wp-block-a8c-duotone-cover__image-background"
					alt=""
					src={ url }
					style={ imageStyle }
				/>
			) }
			{ isVideoBackground && url && (
				<video
					className="wp-block-a8c-duotone-cover__video-background"
					autoPlay
					muted
					loop
					playsInline
					src={ url }
					style={ videoStyle }
				/>
			) }
			<div className="wp-block-a8c-duotone-cover__inner-container">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
