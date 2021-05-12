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

function VariationControlInner( { variations, onChange } ) {
	return useMemo(
		() => (
			<>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={ false }
					contentContainerStyle={
						styles[
							'variation-control-inner__scrollview-container'
						]
					}
					style={ styles[ 'variation-control-inner__scrollview' ] }
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
				<Text style={ styles[ 'variation-control-inner__footer' ] }>
					{ __(
						'Note: Layout may vary between themes and screen sizes',
						'layout-grid'
					) }
				</Text>
			</>
		),
		[ variations, onChange ]
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
		styles[ 'variation-control__cancel-button' ],
		styles[ 'variation-control__cancel-button-dark' ]
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
							style={ styles[ 'variation-control__close-icon' ] }
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
				contentStyle={ styles[ 'variation-control' ] }
				leftButton={ hasLeftButton && leftButton }
			>
				<View style={ styles[ 'variation-control__inner-shell' ] }>
					<VariationControlInner
						variations={ variations }
						onChange={ onVariationSelect }
					/>
				</View>
			</BottomSheet>
		),
		[ variations, isVisible, onClose, onChange ]
	);
}

VariationControl.Inner = VariationControlInner;

export default VariationControl;
