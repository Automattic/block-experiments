/**
 * Internal dependencies
 */
import * as Icon from './icon';

const Forms = ( {} ) => {
	return (
		<div className="forms">
			<Icon.FormTriangle />
			<Icon.FormSquare />
			<Icon.FormCircle />
		</div>
	);
};

const Year = ( { display } ) => {
	switch ( display ) {
		case '1919':
			return <Icon.Year1919 />;
		case '2019':
			return <Icon.Year2019 />;
		case 'range':
			return <Icon.YearRange />;
		default:
			return null;
	}
};

const Ribbon = ( { size } ) => {
	switch ( size ) {
		case 'centered':
			return <Icon.RibbonCentered />;
		case 'full-width':
			return <Icon.RibbonFull />;
		default:
			return null;
	}
};

const Save = ( { attributes, className } ) => {
	return (
		<figure className={ className }>
			{ ( () => {
				switch ( attributes.category ) {
					case 'forms':
						return <Forms size={ attributes.formsSize } />;
					case 'year':
						return <Year display={ attributes.yearDisplay } />;
					case 'ribbon':
						return <Ribbon size={ attributes.ribbonSize } />;
					default:
						return null;
				}
			} )() }
		</figure>
	);
};

export default Save;
