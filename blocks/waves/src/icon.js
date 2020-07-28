/**
 * WordPress dependencies
 */
import { Path, SVG } from '@wordpress/components';

const WavesIcon = ( props ) => {
	return (
		<SVG
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			{ ...props }
		>
			<Path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M4.5 17.2963V19C4.5 19.2761 4.72386 19.5 5 19.5H19C19.2761 19.5 19.5 19.2761 19.5 19V5.28452C18.5693 7.30549 16.2222 11 11.5 11C7.16667 11 5.27778 14.7778 4.5 17.2963ZM3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z"
			/>
		</SVG>
	);
};

export default WavesIcon;
