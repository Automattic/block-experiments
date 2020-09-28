/**
 * WordPress dependencies
 */
import { Path, SVG } from '@wordpress/components';

const StarsIcon = ( props ) => {
	return (
		<SVG
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			{ ...props }
		>
			<Path d="M10.9464 9.8369L9.04878 4L7.14872 9.84433H1L5.97442 13.4563L4.07436 19.3007L9.04878 15.6887L10.9488 14.32L12.1178 13.4603L10.2265 19.2812L15.1916 15.6738L20.1568 19.2812L18.2603 13.4443L23.2254 9.8369H17.0881L15.1916 4L13.2951 9.8369H10.9464Z" />
		</SVG>
	);
};

export default StarsIcon;
