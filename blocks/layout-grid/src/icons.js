/**
 * WordPress dependencies
 */

import { Path, SVG } from '@wordpress/components';

export const GridIcon = ( props ) => {
	const iconProps = { ...props };
	if ( props.size ) {
		iconProps.width = props.size;
		iconProps.height = props.size;
	}

	return (
		<SVG xmlns="http://www.w3.org/2000/svg"
			width="24" height="24"
			viewBox="0 0 24 24"
			{ ...iconProps }
		>
			<Path d="M19 6H6c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7.5 11.5H6c-.3 0-.5-.2-.5-.5V8c0-.3.2-.5.5-.5h5.5v10zm4 0H13v-10h2.5v10zm4-.5c0 .3-.2.5-.5.5h-2v-10h2c.3 0 .5.2.5.5v9z" />
		</SVG>
	);
};

export const GridColumnIcon = ( props ) => (
	<SVG xmlns="http://www.w3.org/2000/svg"
		width="24" height="24"
		viewBox="0 0 24 24"
		{ ...props }
	>
		<Path d="M19 6H6c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM5.5 17V8c0-.3.2-.5.5-.5h5.5v10H6c-.3 0-.5-.2-.5-.5zm14 0c0 .3-.2.5-.5.5h-2v-10h2c.3 0 .5.2.5.5v9z" />
	</SVG>
);

const ColSetup1 = ( props ) => (
	<SVG xmlns="http://www.w3.org/2000/svg"
		width="48" height="48"
		viewBox="0 0 48 48"
		{ ...props }
	>
		<Path d="M7 12v24h34V12H7zm32 22H9V14h30v20z" />
	</SVG>
);

const ColSetup2 = ( props ) => (
	<SVG xmlns="http://www.w3.org/2000/svg"
		width="48" height="48"
		viewBox="0 0 48 48"
		{ ...props }
	>
		<Path d="M7,12v24h34V12H7z M23,34H9V14h14V34z M39,34H25V14h14V34z" />
	</SVG>
);

const ColSetup3 = ( props ) => (
	<SVG xmlns="http://www.w3.org/2000/svg"
		width="48" height="48"
		viewBox="0 0 48 48"
		{ ...props }
	>
		<Path d="M7 12v24h34V12H7zm23 2h9v20h-9V14zm-2 20h-8V14h8v20zM9 14h9v20H9V14z" />
	</SVG>
);

const ColSetup4 = ( props ) => (
	<SVG xmlns="http://www.w3.org/2000/svg"
		width="48" height="48"
		viewBox="0 0 48 48"
		{ ...props }
	>
		<Path d="M7 12v24h34V12H7zm8 22H9V14h6v20zm8 0h-6V14h6v20zm8 0h-6V14h6v20zm8 0h-6V14h6v20z" />
	</SVG>
);

const ColumnIcon = ( { columns, ...props } ) => {
	if ( columns === 4 ) {
		return <ColSetup4 { ...props } />;
	}

	if ( columns === 3 ) {
		return <ColSetup3 { ...props } />;
	}

	if ( columns === 2 ) {
		return <ColSetup2 { ...props } />;
	}

	return <ColSetup1 { ...props } />;
};

export default ColumnIcon;
