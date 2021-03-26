/**
 * External dependencies
 */
import { ScrollView } from 'react-native';

/**
 * WordPress dependencies
 */
import { useNavigation } from '@react-navigation/native';
import { useState } from '@wordpress/element';
import { Icon, chevronRight, check } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';
import { BottomSheet, InserterButton } from '@wordpress/components';
/**
 * Internal dependencies
 */
import styles from './edit.native.scss';

const BottomSheetVariationControl = ( {
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

	const selectedOption = items.find(
		( option ) => option.name === selectedValue
	);

	const goBack = () => {
		setShowSubSheet( false );
		navigation.goBack();
	};

	const openSubSheet = () => {
		navigation.navigate( BottomSheet.SubSheet.screenName );
		setShowSubSheet( true );
	};

	return (
		<BottomSheet.SubSheet
			navigationButton={
				<BottomSheet.Cell
					label={ label }
					separatorType="none"
					value={ selectedOption.title }
					onPress={ openSubSheet }
					accessibilityRole={ 'button' }
					accessibilityLabel={ selectedOption.title }
					accessibilityHint={ sprintf(
						// translators: %s: Select control button label e.g. "Button width"
						__( 'Navigates to select %s' ),
						selectedOption.label
					) }
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
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={ false }
					contentContainerStyle={ styles.contentContainerStyle }
					style={ styles.containerStyle }
				>
					{ items.map( ( variation ) => {
                        console.log( 'variation', variation );
						return (
							<InserterButton
								item={ variation }
								key={ variation.name }
								onSelect={ onChangeValue( variation ) }
							/>
						);
					} ) }
				</ScrollView>
			</>
		</BottomSheet.SubSheet>
	);
};

export default BottomSheetVariationControl;
