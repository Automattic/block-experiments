/**
 * WordPress dependencies
 */

import { Path, SVG } from '@wordpress/components';

export const GridIcon = () => (
	<SVG xmlns="http://www.w3.org/2000/svg"
		width="24" height="24"
		viewBox="0 0 24 24"
	>
		<Path d="M4 5v13h17V5H4zm10 2v9h-3V7h3zM6 7h3v9H6V7zm13 9h-3V7h3v9z" />
	</SVG>
);

const ColSetup1 = () => (
	<SVG xmlns="http://www.w3.org/2000/svg"
		width="48" height="48"
		viewBox="0 0 48 48"
	>
		<Path d="M7 12v24h34V12H7zm32 22H9V14h30v20z" />
	</SVG>
);

const ColSetup2 = () => (
	<SVG xmlns="http://www.w3.org/2000/svg"
		width="48" height="48"
		viewBox="0 0 48 48"
	>
		<Path d="M7,12v24h34V12H7z M23,34H9V14h14V34z M39,34H25V14h14V34z" />
	</SVG>
);

const ColSetup3 = () => (
	<SVG xmlns="http://www.w3.org/2000/svg"
		width="48" height="48"
		viewBox="0 0 48 48"
	>
		<Path d="M7 12v24h34V12H7zm23 2h9v20h-9V14zm-2 20h-8V14h8v20zM9 14h9v20H9V14z" />
	</SVG>
);

const ColSetup4 = () => (
	<SVG xmlns="http://www.w3.org/2000/svg"
		width="48" height="48"
		viewBox="0 0 48 48"
	>
		<Path d="M7 12v24h34V12H7zm8 22H9V14h6v20zm8 0h-6V14h6v20zm8 0h-6V14h6v20zm8 0h-6V14h6v20z" />
	</SVG>
);

const ColumnIcon = ( { columns } ) => {
	if ( columns === 4 ) {
		return <ColSetup4 />;
	}

	if ( columns === 3 ) {
		return <ColSetup3 />;
	}

	if ( columns === 2 ) {
		return <ColSetup2 />;
	}

	return <ColSetup1 />;
};

export default ColumnIcon;
