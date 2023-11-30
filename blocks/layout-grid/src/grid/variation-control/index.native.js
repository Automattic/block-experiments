/**
 * External dependencies
 */
import {
	ScrollView,
	View,
	Text,
	TouchableWithoutFeedback,
	TouchableHighlight,
	Platform,
} from 'react-native';

/**
 * WordPress dependencies
 */
import { usePreferredColorSchemeStyle } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { BottomSheet } from '@wordpress/components';
import { InserterButton } from '@wordpress/block-editor';
import { Icon, close } from '@wordpress/icons';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import styles from './style.native.scss';

function VariationControlSelectedButton( { name, icon } ) {
	const buttonBorder = usePreferredColorSchemeStyle(
		styles[ 'variation-control-selected-button__item' ],
		styles[ 'variation-control-selected-button__item-dark' ]
	);

	const labelIconStyle = usePreferredColorSchemeStyle(
		styles[ 'variation-control-selected-button__label-icon' ],
		styles[ 'variation-control-selected-button__label-icon-dark' ]
	);

	const labelStyle = usePreferredColorSchemeStyle(
		styles[ 'variation-control-selected-button__label' ],
		styles[ 'variation-control-selected-button__label-dark' ]
	);
	return (
		<TouchableHighlight
			style={ [
				InserterButton.Styles.modalItem,
				styles[ 'variation-control-selected-button' ],
			] }
		>
			<>
				<View
					style={ [
						InserterButton.Styles.modalIconWrapper,
						buttonBorder,
					] }
				>
					<View style={ labelIconStyle }>
						<Icon
							icon={ icon }
							fill={ labelIconStyle.fill }
							size={ labelIconStyle.width }
						/>
					</View>
				</View>
				<Text style={ labelStyle }>{ name }</Text>
			</>
		</TouchableHighlight>
	);
}

function VariationControlInner( { variations, onChange, selected = null } ) {
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
						const isSelected = variation.name === selected;
						return (
							<View
								key={ variation.name }
								style={
									styles[ 'variation-control-inner__item' ]
								}
							>
								{ isSelected ? (
									<VariationControlSelectedButton
										name={ variation.title }
										icon={ variation.icon }
									/>
								) : (
									<InserterButton
										item={ variation }
										maxWidth={ 112 }
										key={ variation.name }
										onSelect={ () => onChange( variation ) }
									/>
								) }
							</View>
						);
					} ) }
				</ScrollView>
				<Text style={ styles[ 'variation-control-inner__footer' ] }>
					{ __(
						'Note: Layout may vary between themes and screen sizes',
						'layout-grid'
					) }
				</Text>
				{ selected && (
					<Text
						style={ [
							styles[ 'variation-control-inner__footer' ],
							styles[ 'variation-control-inner__footer-last' ],
						] }
					>
						{ __(
							'Changing the number of columns will reset your layout and could remove content.',
							'layout-grid'
						) }
					</Text>
				) }
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
