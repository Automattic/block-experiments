/**
 * WordPress dependencies
 */
import { Path, SVG } from '@wordpress/components';

const StarsIcon = ( props ) => {
	return (
		<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" { ...props } >
			<Path d="M19,9 L20.25,6.25 L23,5 L20.25,3.75 L19,1 L17.75,3.75 L15,5 L17.75,6.25 L19,9 Z M11.5,9.5 L9,4 L6.5,9.5 L1,12 L6.5,14.5 L9,20 L11.5,14.5 L17,12 L11.5,9.5 Z M19,15 L17.75,17.75 L15,19 L17.75,20.25 L19,23 L20.25,20.25 L23,19 L20.25,17.75 L19,15 Z" />
		</SVG>
	);
};

export default StarsIcon;
