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
import { columns } from '@wordpress/icons';
/**
 * Internal dependencies
 */
import styles from './edit.native.scss';

const BottomSheetResponsiveBreakpointsControl = ( {
	label,
	options: items,
	onChange,
	value: selectedValue,
} ) => {
	const [ showSubSheet, setShowSubSheet ] = useState( false );
	const navigation = useNavigation();

	const onChangeValue = ( value ) => {
		return () => {
			goBack();
			onChange( value );
		};
	};

	const goBack = () => {
		setShowSubSheet( false );
		navigation.goBack();
	};

	const openSubSheet = () => {
		navigation.navigate( BottomSheet.SubSheet.screenName );
		setShowSubSheet( true );
	};

    const onChangeColumnsNum = ( value ) => {
        console.log( 'onChangeColumnsNum', value );
    }

    const columnRangeControls = () => {
        var columns = [];
        for ( var i = 1; i < 4; i++ ) {
            columns.push( 
            ( <View style={ styles.rangeControl } key={ 'column-' + i }>
                <Text style={ styles.rangeControlHeading } >{'Column ' + i }</Text>
                <RangeControl
                    label={ __( 'Offset' ) }
                    icon={ columns }
                    value={ 1 }
                    onChange={ onChangeColumnsNum }
                    min={ 0 }
                    max={ 5 }
                    type="stepper"
                    separatorType="none"
                />
                <RangeControl
                    label={ __( 'Span' ) }
                    icon={ columns }
                    value={ 1 }
                    onChange={ onChangeColumnsNum }
                    min={ 0 }
                    max={ 5 }
                    type="stepper"
                    separatorType="none"
                />
            </View>
            ) );
        }
        return columns;
    }

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
                    segments={ [ 'Desktop', 'Tablet', 'Mobile' ] }
                    segmentHandler= { ( segment ) => { console.log( segment ) } }
                    selectedIndex={ 0 }
                />
                { columnRangeControls() }
                
                
			</>
		</BottomSheet.SubSheet>
	);
};

export default BottomSheetResponsiveBreakpointsControl;
