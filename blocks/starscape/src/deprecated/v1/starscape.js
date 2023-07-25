/**
 * External dependencies
 */
import classnames from 'classnames';

const Starscape = ( {
	starStyles,
	animationStyles,
	children,
	className,
	...props
} ) => {
	return (
		<div
			className={ classnames( 'wp-block-a8c-starscape', className ) }
			{ ...props }
		>
			<div
				className="wp-block-a8c-starscape__stars"
				style={ {
					...starStyles[ 0 ],
					...animationStyles[ 0 ],
				} }
			/>
			<div
				className="wp-block-a8c-starscape__stars"
				style={ {
					...starStyles[ 1 ],
					...animationStyles[ 1 ],
				} }
			/>
			<div
				className="wp-block-a8c-starscape__stars"
				style={ {
					...starStyles[ 2 ],
					...animationStyles[ 2 ],
				} }
			/>
			{ children }
		</div>
	);
};

export default Starscape;
