/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import * as Icon from './icon';

const variations = {
	1919: Icon.Year1919,
	2019: Icon.Year2019,
	range: Icon.YearRange,
};

const Year = ( { attributes } ) => {
	const YearVariation = variations[ attributes.year ];
	return <YearVariation className="year" height={ attributes.height } />;
};

const Content = Year;

const ExtraStyles = ( { setAttributes } ) => (
	<SelectControl
		options={ [
			{ label: __( '1919' ), value: '1919' },
			{ label: __( '2019' ), value: '2019' },
			{ label: __( '1919–2019' ), value: 'range' },
		] }
		onChange={ ( year ) => setAttributes( { year } ) }
	/>
);

export default Object.assign( Year, {
	label: __( 'Year' ),
	icon: <Icon.YearIcon />,
	preview: <Icon.YearPreview />,
	Content,
	ExtraStyles,
} );
