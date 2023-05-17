/**
 * WordPress dependencies
 */

import { useEffect } from '@wordpress/element';
import { useViewportMatch, useResizeObserver } from '@wordpress/compose';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	Button,
	ToolbarGroup,
	MenuGroup,
	MenuItemsChoice,
	Dropdown,
} from '@wordpress/components';
import { BlockControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */

import { getLayouts } from '../constants';

function getCurrentViewport( isMobile, isTablet ) {
	if ( isMobile ) {
		return 'Mobile';
	}

	if ( isTablet ) {
		return 'Tablet';
	}

	return 'Desktop';
}

function PreviewDevice( props ) {
	const { viewPort, updateViewport } = props;
	const {
		__experimentalSetPreviewDeviceType: setPreviewDevice,
	} = useDispatch( 'core/edit-post' ) || useDispatch( 'core/edit-site' );
	const previewDevice = useSelect(
		( select ) =>
			( select( 'core/edit-site' ) || select( 'core/edit-post' ) ).__experimentalGetPreviewDeviceType(),
		[]
	);
	const [ resizeListener, sizes ] = useResizeObserver();
	const isTablet = useViewportMatch( 'medium', '<' );
	const isMobile = useViewportMatch( 'small', '<' );

	useEffect( () => {
		const newPort = getCurrentViewport( isMobile, isTablet );

		if ( newPort !== viewPort ) {
			updateViewport( newPort );
		}
	}, [ sizes ] );

	return (
		<>
			{ resizeListener }

			{ ! isMobile && (
				<BlockControls>
					<Dropdown
						renderToggle={ ( { isOpen, onToggle } ) => (
							<ToolbarGroup>
								<Button
									aria-expanded={ isOpen }
									onClick={ onToggle }
									icon={
										getLayouts().find(
											( layout ) =>
												layout.value === previewDevice
										).icon
									}
								/>
							</ToolbarGroup>
						) }
						renderContent={ () => (
							<MenuGroup>
								<MenuItemsChoice
									value={ previewDevice }
									onSelect={ ( mode ) =>
										setPreviewDevice( mode )
									}
									choices={ getLayouts() }
								/>
							</MenuGroup>
						) }
					/>
				</BlockControls>
			) }
		</>
	);
}

export default PreviewDevice;
