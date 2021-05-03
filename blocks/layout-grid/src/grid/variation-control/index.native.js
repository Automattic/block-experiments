/**
 * External dependencies
 */
 import {
	ScrollView,
	View,
	Text,
	TouchableWithoutFeedback,
	Platform,
} from 'react-native';

/**
 * WordPress dependencies
 */
import { usePreferredColorSchemeStyle } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { BottomSheet, InserterButton } from '@wordpress/components';
import { Icon, close } from '@wordpress/icons';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import styles from './style.native.scss';

function VariationControlInner( { variations, onChange, hasHeader = true } ) {

	const bottomSheetHeaderTitleStyle = usePreferredColorSchemeStyle(
		styles[ 'vatiation-control-inner__header-text' ],
		styles[ 'vatiation-control-inner__header-text-dark' ]
	);

	return useMemo(
		() => (
			<>
				{ hasHeader && (
					<View style={ styles[ 'vatiation-control-inner__header' ] }>
						<Text
							style={ bottomSheetHeaderTitleStyle }
							maxFontSizeMultiplier={ 3 }
						>
							{
								__(
									'Select a layout'
								) /* This is intentionally without a translation domain. */
							}
						</Text>
					</View>
				) }
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={ false }
					contentContainerStyle={
						styles[ 'vatiation-control__scrollview-container' ]
					}
					style={ styles[ 'vatiation-control__scrollview' ] }
				>
					{ variations.map( ( variation ) => {
						return (
							<InserterButton
								item={ variation }
								key={ variation.name }
								onSelect={ () => onChange( variation ) }
							/>
						);
					} ) }
				</ScrollView>
			</>
		),
		[ variations, onChange, hasHeader ]
	);
}

const hitSlop = { top: 22, bottom: 22, left: 22, right: 22 };
function VariationControl( {
	isVisible,
	onClose,
	variations,
	onChange,
	hasLeftButton,
} ) {
	const isIOS = Platform.OS === 'ios';

	const cancelButtonStyle = usePreferredColorSchemeStyle(
		styles[ 'vatiation-control__cancel-button' ],
		styles[ 'vatiation-control__cancel-button-dark' ]
	);

	const leftButton = useMemo(
		() => (
			<TouchableWithoutFeedback onPress={ onClose } hitSlop={ hitSlop }>
				<View>
					{ isIOS ? (
						<Text
							style={ cancelButtonStyle }
							maxFontSizeMultiplier={ 2 }
						>
							{
								__(
									'Cancel'
								) /* This is intentionally without a translation domain. */
							}
						</Text>
					) : (
						<Icon
							icon={ close }
							size={ 24 }
							style={ styles[ 'vatiation-control__close-icon' ] }
						/>
					) }
				</View>
			</TouchableWithoutFeedback>
		),
		[ onClose, cancelButtonStyle ]
	);

	const onVariationSelect = ( variation ) => {
		onChange( variation );
		onClose();
	};

	return useMemo(
		() => (
			<BottomSheet
				isVisible={ isVisible }
				onClose={ onClose }
				title={
					__(
						'Select a layout'
					) /* This is intentionally without a translation domain. */
				}
				contentStyle={ styles[ 'vatiation-control' ] }
				leftButton={ hasLeftButton && leftButton }
			>
				<VariationControlInner
					variations={ variations }
					onChange={ onVariationSelect }
					hasHeader={ false }
				/>
			</BottomSheet>
		),
		[ variations, isVisible, onClose ]
	);
}

VariationControl.Inner = VariationControlInner;

export default VariationControl;
