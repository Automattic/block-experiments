/**
 * WordPress dependencies
 */
import { forwardRef } from '@wordpress/element';

/**
 * @typedef {Object} StarscapeProps
 * @property {string}    [as]            HTML tag name.
 * @property {Object}    starStyles      Styles for the stars.
 * @property {Object}    animationStyles Styles for the animation.
 * @property {number}    intensity       Intensity of the stars.
 * @property {WPElement} [children]      Children of the component.
 */

/**
 * Starscape background effect component.
 *
 * @param {StarscapeProps} props Starscape props
 * @param {Ref}            ref   React ref
 *
 * @returns {WPElement} Starscape component
 */
const Starscape = (
	{
		as: Component = 'div',
		starStyles,
		animationStyles,
		intensity,
		children,
		...props
	},
	ref
) => {
	return (
		<Component ref={ ref } { ...props }>
			{ [ 0, 1, 2 ].map( ( i ) => (
				<div
					key={ i }
					className="wp-block-a8c-starscape__stars"
					style={ {
						opacity: intensity / 100,
						...starStyles[ i ],
						...animationStyles[ i ],
					} }
				/>
			) ) }
			{ children }
		</Component>
	);
};

export default forwardRef( Starscape );
