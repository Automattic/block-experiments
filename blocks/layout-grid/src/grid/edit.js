/**
 * External dependencies
 */

import { times } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */

import {
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { Component, createRef } from '@wordpress/element';
import { PanelBody, TextControl, ButtonGroup, Button, Placeholder, IsolatedEventContainer } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ENTER, SPACE } from '@wordpress/keycodes';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */

import { getAsDeviceCSS, removeGridClasses } from './css-classname';
import ColumnIcon from '../icons';
import { getLayouts, getColumns, DEVICE_BREAKPOINTS, getSpanForDevice, getOffsetForDevice } from '../constants';
import { getGridWidth, getDefaultSpan } from './grid-defaults';
import ResizeGrid from './resize-grid';
import LayoutGrid from './layout-grid';

const ALLOWED_BLOCKS = [ 'jetpack/layout-grid-column' ];
const MINIMUM_RESIZE_SIZE = 50; // Empirically determined to be a good size

class Edit extends Component {
	constructor( props ) {
		super( props );

		this.overlayRef = createRef();
		this.state = {
			selectedDevice: getLayouts()[ 0 ].value,
		};
	}

	/*
	 * Change the layout (number of columns), resetting everything to the default
	 */
	onChangeLayout = ( columns ) => {
		const columnValues = {};

		for ( let pos = 0; pos < columns; pos++ ) {
			for ( let device = 0; device < DEVICE_BREAKPOINTS.length; device++ ) {
				const defaultSpan = getDefaultSpan( DEVICE_BREAKPOINTS[ device ], columns, pos );

				columnValues[ getSpanForDevice( pos, DEVICE_BREAKPOINTS[ device ] ) ] = defaultSpan;
				columnValues[ getOffsetForDevice( pos, DEVICE_BREAKPOINTS[ device ] ) ] = 0;
			}
		}

		this.props.updateColumns( this.props.columns, columns, columnValues );
	}

	onChangeDevice = ( selectedDevice ) => {
		this.setState( { selectedDevice } );
	}

	onResize = ( column, adjustment ) => {
		const { attributes, columns } = this.props;
		const grid = new LayoutGrid( attributes, this.state.selectedDevice, columns );
		const adjustedGrid = grid.getAdjustedGrid( column, adjustment );

		if ( adjustedGrid ) {
			this.adjustGrid( adjustedGrid );
		}
	}

	onChangeSpan = ( column, device, value ) => {
		const { attributes, columns } = this.props;
		const grid = new LayoutGrid( attributes, device, columns );
		const adjustedGrid = grid.getAdjustedGrid( column, { span: parseInt( value, 10 ) } );

		if ( adjustedGrid ) {
			this.adjustGrid( adjustedGrid );
		}
	}

	onChangeOffset = ( column, device, value ) => {
		const { attributes, columns } = this.props;
		const grid = new LayoutGrid( attributes, device, columns );
		const adjustedGrid = grid.getAdjustedGrid( column, { start: grid.convertOffsetToStart( column, parseInt( value, 10 ) ) } );

		if ( adjustedGrid ) {
			this.adjustGrid( adjustedGrid );
		}
	}

	adjustGrid( grid ) {
		const { setAttributes, attributes } = this.props;

		setAttributes( {
			...grid,
			className: removeGridClasses( attributes.className ),
		} );
	}

	renderDeviceSettings( columns, device, attributes ) {
		const grid = new LayoutGrid( attributes, device, this.props.columns );
		const settings = [];

		for ( let column = 0; column < columns; column++ ) {
			const span = grid.getSpan( column ) || getDefaultSpan( device, columns, column );
			const offset = grid.getOffset( column ) || 0;

			settings.push( (
				<div className="jetpack-layout-grid-settings" key={ column }>
					<strong>{ __( 'Column' ) } { column + 1 }</strong>
					<div className="jetpack-layout-grid-settings__group">
						<TextControl
							type="number"
							label={ __( 'Offset' ) }
							value={ offset || 0 }
							min={ 0 }
							max={ getGridWidth( device ) - 1 }
							onChange={ ( value ) => this.onChangeOffset( column, device, value ) }
						/>
						<TextControl
							type="number"
							label={ __( 'Span' ) }
							value={ span }
							min={ 1 }
							max={ getGridWidth( device ) }
							onChange={ ( value ) => this.onChangeSpan( column, device, value ) }
						/>
					</div>
				</div>
			) );
		}

		return settings;
	}

	getPreviewText( device ) {
		if ( device === 'Mobile' ) {
			return __( 'Showing mobile layout' );
		} else if ( device === 'Tablet' ) {
			return __( 'Showing tablet layout' );
		}

		return __( 'Showing desktop layout' );
	}

	canResizeBreakpoint( device ) {
		if ( this.overlayRef && this.overlayRef.current ) {
			const { width } = this.overlayRef.current.getBoundingClientRect();

			return width / getGridWidth( device ) > MINIMUM_RESIZE_SIZE;
		}

		return false;
	}

	render() {
		const {
			className,
			attributes = {},
			isSelected,
			columns,
		} = this.props;
		const { selectedDevice } = this.state;
		const extra = getAsDeviceCSS( selectedDevice, columns, attributes );
		const layoutGrid = new LayoutGrid( attributes, selectedDevice, columns );
		const classes = classnames(
			removeGridClasses( className ),
			extra,
			{
				'wp-block-jetpack-layout-tablet': selectedDevice === 'Tablet',
				'wp-block-jetpack-layout-desktop': selectedDevice === 'Desktop',
				'wp-block-jetpack-layout-mobile': selectedDevice === 'Mobile',
				'wp-block-jetpack-layout-resizable': this.canResizeBreakpoint( selectedDevice ),
			}
		);

		if ( columns === 0 ) {
			return (
				<Placeholder
					icon="layout"
					label={ __( 'Choose Layout' ) }
					instructions={ __( 'Select a layout to start with:' ) }
					className={ classes }
				>
					<ul className="block-editor-inner-blocks__template-picker-options">
						{ getColumns().map( ( column ) => (
							<li key={ column.value }>
								<Button
									isSecondary
									icon={ <ColumnIcon columns={ column.value } /> }
									onClick={ () => this.onChangeLayout( column.value ) }
									className="block-editor-inner-blocks__template-picker-option"
									label={ column.label }
								/>
							</li>
						) ) }
					</ul>
				</Placeholder>
			);
		}

		return (
			<IsolatedEventContainer>
				<ResizeGrid
					className={ classes }
					onResize={ this.onResize }
					totalColumns={ getGridWidth( selectedDevice ) }
					layoutGrid={ layoutGrid }
					isSelected={ isSelected }
				>
					<div className="wpcom-overlay-grid" ref={ this.overlayRef }>
						{ times( getGridWidth( selectedDevice ) ).map( ( item ) => <div className="wpcom-overlay-grid__column" key={ item }></div> ) }
					</div>

					<InnerBlocks
						template={ null }
						templateLock="all"
						allowedBlocks={ ALLOWED_BLOCKS }
					/>

					<InspectorControls>
						<PanelBody title={ __( 'Layout' ) }>
							<div className="jetpack-layout-grid-columns block-editor-block-styles">
								{ getColumns().map( ( column ) => (
									<div
										key={ column.value }
										className={ classnames(
											'block-editor-block-styles__item', {
												'is-active': columns === column.value,
											}
										) }
										onClick={ () => this.onChangeLayout( column.value ) }
										onKeyDown={ ( event ) => {
											if ( ENTER === event.keyCode || SPACE === event.keyCode ) {
												event.preventDefault();
												this.onChangeLayout( column.value );
											}
										} }
										role="button"
										tabIndex="0"
										aria-label={ column.label }
									>
										<div className="block-editor-block-styles__item-preview">
											<ColumnIcon columns={ column.value } />
										</div>
										<div className="editor-block-styles__item-label block-editor-block-styles__item-label">
											{ column.label }
										</div>
									</div>
								) ) }
							</div>

							<p><em>{ __( 'Changing the number of columns will reset your layout and could remove content.' ) }</em></p>
						</PanelBody>

						<PanelBody title={ __( 'Responsive Breakpoints' ) }>
							<p><em>{ __( "Note that previewing your post will show your browser's breakpoint, not the currently selected one." ) }</em></p>
							<ButtonGroup>
								{ getLayouts().map( ( layout ) => (
									<Button
										key={ layout.value }
										isDefault
										isPrimary={ layout.value === selectedDevice }
										onClick={ () => this.onChangeDevice( layout.value ) }
									>
										{ layout.label }
									</Button>
								) ) }
							</ButtonGroup>

							{ this.renderDeviceSettings( columns, selectedDevice, attributes ) }
						</PanelBody>
					</InspectorControls>

					<div className="jetpack-layout-grid-previewing">{ this.getPreviewText( selectedDevice ) }</div>
				</ResizeGrid>
			</IsolatedEventContainer>
		);
	}
}

function getColumnBlocks( currentBlocks, previous, columns ) {
	if ( columns > previous ) {
		// Add new blocks to the end
		return [
			...currentBlocks,
			...times( columns - previous, () => createBlock( 'jetpack/layout-grid-column' ) ),
		];
	}

	// A little ugly but... ideally we remove empty blocks first, and then anything with content from the end
	let cleanedBlocks = [ ...currentBlocks ];
	let totalRemoved = 0;

	// Reverse the blocks so we start at the end. This happens in-place
	cleanedBlocks.reverse();

	// Remove empty blocks
	cleanedBlocks = cleanedBlocks.filter( ( block ) => {
		if ( totalRemoved < previous - columns && block.innerBlocks.length === 0 ) {
			totalRemoved++;
			return false;
		}

		return true;
	} );

	// If we still need to remove blocks then do them from the beginning before flipping it back round
	return cleanedBlocks
		.slice( Math.max( 0, previous - columns - totalRemoved ) )
		.reverse();
}

export default compose( [
	withDispatch( ( dispatch, ownProps, registry ) => ( {
		updateColumns( previous, columns, columnValues ) {
			const { clientId } = ownProps;
			const { replaceBlock } = dispatch( 'core/block-editor' );
			const { getBlocks } = registry.select( 'core/block-editor' );
			const innerBlocks = getColumnBlocks( getBlocks( clientId ), previous, columns );

			// Replace the whole block with a new one so that our changes to both the attributes and innerBlocks are atomic
			// This ensures that the undo history has a single entry, preventing traversing to a 'half way' point where innerBlocks are changed
			// but the column attributes arent
			const blockCopy = createBlock( ownProps.name, {
				...ownProps.attributes,
				...columnValues,
			}, innerBlocks );

			replaceBlock( clientId, blockCopy );
		},
	} ) ),
	withSelect( ( select, { clientId } ) => {
		return {
			columns: select( 'core/block-editor' ).getBlockCount( clientId ),
		};
	} ),
] )( Edit );
