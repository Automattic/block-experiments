/**
 * External dependencies
 */
import { View, Text } from 'react-native';

/**
 * WordPress dependencies
 */
import { useNavigation } from '@react-navigation/native';
import { useState } from '@wordpress/element';
import { Icon, chevronRight, check } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';
import { BottomSheet, SegmentedControls, RangeControl, } from '@wordpress/components';

import { getGridWidth, getDefaultSpan } from './grid-defaults';
/**
 * Internal dependencies
 */
 import {
	DEVICE_BREAKPOINTS,
	getSpanForDevice,
	getOffsetForDevice,
	getLayouts,
} from './../constants';
import LayoutGrid from './layout-grid';
import styles from './edit.native.scss';

const BottomSheetResponsiveBreakpointsControl = ( {
	label,
	options: items,
	onChange,
	value: selectedValue,
	columns: numberOfColumns,
} ) => {
	const [ showSubSheet, setShowSubSheet ] = useState( false );
	const [ currentDevice, setCurrentDevice ] = useState(
		DEVICE_BREAKPOINTS[ 0 ]
	); // Default current device. "Desktop"

	const navigation = useNavigation();

	/**
	 * Brings you back to the original settings.
	 */
	const goBack = () => {
		setShowSubSheet( false );
		navigation.goBack();
	};

	/**
	 * Runs after you Click Edit.
	 */
	const openSubSheet = () => {
		navigation.navigate( BottomSheet.SubSheet.screenName );
		setShowSubSheet( true );
	};
	/**
	 * Helper function that passed back attributes key and value to updated.
	 *
	 * @param {string} key
	 * @param {string} value
	 */
	const onChangeColumnsNum = ( key, value ) => {
		onChange( key, value );
	};
	/**
	 * Helper function that returns the column controls.
	 *
	 * @return {Array} Array of React Components.
	 */
	const columnRangeControls = () => {
		const columnsControls = [];

		const grid = new LayoutGrid( items, currentDevice, numberOfColumns );

		for ( let column = 0; column < numberOfColumns; column++ ) {
			const offsetKey = getOffsetForDevice( column, currentDevice );
			const spanKey = getSpanForDevice( column, currentDevice );

			const span =
				grid.getSpan( column ) ||
				getDefaultSpan( currentDevice, numberOfColumns, column );
			const offset = grid.getOffset( column ) || 0;

			const columnNumber = column + 1;

			columnsControls.push(
				<View
					style={ styles[ 'range-control' ] }
					key={ 'column-' + column }
				>
					<Text style={ styles[ 'range-control__heading' ] }>
						{ sprintf(
							// translators: %d: Inter that identifies the column. For example Column 1.
							__( 'Column %d', 'layout-grid' ),
							columnNumber
						) }
					</Text>
					<RangeControl
						label={ __( 'Offset', 'layout-grid' ) }
						value={ offset || 0 }
						onChange={ onChangeColumnsNum.bind( this, offsetKey ) }
						min={ 0 }
						max={ getGridWidth( currentDevice ) }
						type="stepper"
						separatorType="none"
					/>
					<RangeControl
						label={ __( 'Span', 'layout-grid' ) }
						value={ span }
						onChange={ onChangeColumnsNum.bind( this, spanKey ) }
						min={ 1 }
						max={ getGridWidth( currentDevice ) + 1 }
						type="stepper"
						separatorType="none"
					/>
				</View>
			);
		}

		return columnsControls;
	}

	const deviceNames = getLayouts().map( ( layout ) => {
		return layout.label;
	} );

	return (
		<BottomSheet.SubSheet
			navigationButton={
				<BottomSheet.Cell
					label={ label }
					separatorType="none"
					value={ selectedValue }
					onPress={ openSubSheet }
					accessibilityRole={ 'button' }
					accessibilityLabel={ selectedValue }
				>
					<Icon icon={ chevronRight }></Icon>
				</BottomSheet.Cell>
			}
			showSheet={ showSubSheet }
		>
			<>
				<BottomSheet.NavigationHeader
					screen={ label }
					leftButtonOnPress={ goBack }
				/>
				<SegmentedControls
					segments={ deviceNames }
					segmentHandler={ setCurrentDevice }
					selectedIndex={ 0 }
				/>
				{ columnRangeControls() }
			</>
		</BottomSheet.SubSheet>
	);
};

export default BottomSheetResponsiveBreakpointsControl;
