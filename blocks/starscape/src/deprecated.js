/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { RichText, getColorClassName } from '@wordpress/block-editor';

/**
 * Deprecation for converting from RichText to InnerBlocks.
 *
 * @see https://github.com/Automattic/block-experiments/pull/334
 */
const v1 = {
	supports: {
		html: false,
		align: true,
	},
	attributes: {
		align: {
			type: 'string',
			default: 'full',
		},
		textAlign: {
			type: 'string',
			default: 'center',
		},
		density: {
			type: 'int',
			default: 20,
		},
		speed: {
			type: 'int',
			default: 20,
		},
		maxWidth: {
			type: 'int',
			default: 1920,
		},
		maxHeight: {
			type: 'int',
			default: 1080,
		},
		starStyles: {
			type: 'array',
			default: generated.starStyles,
		},
		animationStyles: {
			type: 'array',
			default: generated.animationStyles,
		},
		heading: {
			type: 'string',
		},
		textColor: {
			type: 'string',
		},
		customTextColor: {
			type: 'string',
			default: '#ffffff',
		},
		background: {
			type: 'string',
			default: '#00000c',
		},
	},
	migrate: ( attributes ) => {
		// Remove the heading attribute.
		const { heading, ...rest } = attributes;
		return { ...rest };
	},
	save( { attributes } ) {
		const textColorClass = getColorClassName(
			'color',
			attributes.textColor
		);

		return (
			<div
				className={ classnames( 'wp-block-a8c-starscape', className ) }
				style={ { background: attributes.background } }
			>
				<div
					className="wp-block-a8c-starscape__stars"
					style={ {
						...attributes.starStyles[ 0 ],
						...attributes.animationStyles[ 0 ],
					} }
				/>
				<div
					className="wp-block-a8c-starscape__stars"
					style={ {
						...attributes.starStyles[ 1 ],
						...attributes.animationStyles[ 1 ],
					} }
				/>
				<div
					className="wp-block-a8c-starscape__stars"
					style={ {
						...attributes.starStyles[ 2 ],
						...attributes.animationStyles[ 2 ],
					} }
				/>
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
			</div>
		);
	},
};

// Export all deprecated versions in reverse chronological order.
export default [ v1 ];
