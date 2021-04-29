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
import { withSelect } from '@wordpress/data';
import { compose, usePreferredColorSchemeStyle } from '@wordpress/compose';
import { store as blocksStore } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { BottomSheet, InserterButton } from '@wordpress/components';
import { Icon, close } from '@wordpress/icons';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import styles from './style.native.scss';

const hitSlop = { top: 22, bottom: 22, left: 22, right: 22 };

function VariationControl( { isVisible, onClose, variations, onChange, hasLeftButton } ) {
	const isIOS = Platform.OS === 'ios';

	const cancelButtonStyle = usePreferredColorSchemeStyle(
		styles['vatiation-control__cancel-button'],
		styles['vatiation-control__cancel-button-dark']
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
							{ __( 'Cancel' ) }
						</Text>
					) : (
						<Icon
							icon={ close }
							size={ 24 }
							style={styles['vatiation-control__close-icon'] }
						/>
					) }
				</View>
			</TouchableWithoutFeedback>
		),
		[ onClose, cancelButtonStyle ]
	);

	const onVariationSelect = ( variation ) => {
        onChange( variation );
		onClose && onClose();
	};

	return useMemo(
		() => (
			<BottomSheet
				isVisible={ isVisible }
				onClose={ onClose }
				title={ __( 'Select a layout' ) }
				contentStyle={ styles['vatiation-control'] }
				leftButton={ hasLeftButton && leftButton }
			>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={ false }
					contentContainerStyle={ styles['vatiation-control__scrollview-container'] }
					style={ styles['vatiation-control__scrollview'] }
				>
					{ variations.map( ( v ) => {
						return (
							<InserterButton
								item={ v }
								key={ v.name }
								onSelect={ () => onVariationSelect( v ) }
							/>
						);
					} ) }
				</ScrollView>
			</BottomSheet>
		),
		[ variations, isVisible, onClose ]
	);
}

export default VariationControl;
