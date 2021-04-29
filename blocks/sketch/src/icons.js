/**
 * WordPress dependencies
 */
import { Circle, Path, Rect, SVG } from '@wordpress/components';

export const BlockIcon = () => (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 17 17"
		fill="none"
	>
		<Path
			d="M6.432.51c-.988.253-1.868.761-2.657 1.42a7.86 7.86 0 0 0-1.71 2.02 7.93 7.93 0 0 0-.939 2.43 7.06 7.06 0 0 0-.15 1.343c-.005.354.009.707.04 1.057a8.1 8.1 0 0 0 .724 2.642c.334.712.767 1.374 1.287 1.961s1.125 1.1 1.792 1.513c.742.456 1.551.798 2.401.986.678.152 1.378.226 2.075.192.675-.03 1.351-.132 1.998-.333.411-.127.812-.28 1.202-.472 1.853-.911 2.914-2.292 3.544-4.249.455-1.414.433-3.509.212-4.605s-.352-.613-.352-.613.101 1.147.003 1.901c-.477 3.669-2.191 4.943-2.942 5.391-2.906 1.732-5.619 1.704-7.619-.695-1.447-1.737-1.628-3.487-.622-5.484s2.479-3.138 3.296-4.379S7.561.221 6.432.51z"
			fill="#000"
			stroke="#000"
			strokeWidth=".5"
		/>
	</SVG>
);

export const ColorControlIcon = ( { color } ) => (
	<SVG width="24" height="24" viewBox="0 0 16 16" fill="none">
		<Circle
			cx="8"
			cy="8"
			r="6"
			style={ { fill: color, filter: 'brightness(0.8)' } }
		/>
		<Circle cx="8" cy="8" r="4.5" style={ { fill: color } } />
	</SVG>
);

export const BrushSizeControlIcon = () => (
	<SVG width="24" height="24" viewBox="0 0 24 24" fill="none">
		<Rect x="9" y="5" width="6" height="2" rx="1" />
		<Rect x="7" y="10" width="10" height="3" rx="1.5" />
		<Rect x="5" y="16" width="14" height="4" rx="2" />
	</SVG>
);

export const BrushSizeIcon = ( { radius = 8 } ) => (
	<SVG width="24" height="24" viewBox="0 0 16 16" fill="none">
		<Circle cx="8" cy="8" r={ radius } />
		<Circle
			cx="8"
			cy="8"
			r={ radius - 1 }
			stroke="#00131C"
			strokeOpacity="0.2"
			strokeWidth="1.5"
		/>
	</SVG>
);
