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
import {
	BlockControls,
	BlockVerticalAlignmentToolbar,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ButtonGroup,
	Button,
	IconButton,
	Placeholder,
	IsolatedEventContainer,
	ToggleControl,
	SelectControl,
	Disabled,
	ToolbarGroup,
	MenuGroup,
	MenuItem,
	Dropdown,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ENTER, SPACE } from '@wordpress/keycodes';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */

import {
	getAsEditorCSS,
	removeGridClasses,
	getGutterClasses,
} from './css-classname';
import ColumnIcon from '../icons';
import { getLayouts, getColumns, DEVICE_BREAKPOINTS, getSpanForDevice, getOffsetForDevice, getGutterValues } from '../constants';
import { getGridWidth, getDefaultSpan } from './grid-defaults';
import ResizeGrid from './resize-grid';
import LayoutGrid from './layout-grid';

const ALLOWED_BLOCKS = [ 'jetpack/layout-grid-column' ];
const MINIMUM_RESIZE_SIZE = 50; // Empirically determined to be a good size

/** 
 * get the width of the editor, taking into account preview mode.
 */
function getEditorDeviceWidth() {
	const visualEditorEl = document.querySelector('.editor-styles-wrapper');
	const width = visualEditorEl ? visualEditorEl.offsetWidth : window.innerWidth;
	if ( width < 600 ) {
		return 'Mobile';
	} else if ( width < 1080 ) {
		return 'Tablet';
	} else {
		return 'Desktop';
	}
}

// Note this uses __experimentalGetPreviewDeviceType, but has a fallback for older versions of Gutenberg.
// The fallback will be removed once WordPress contains supports for __experimentalGetPreviewDeviceType
class Edit extends Component {
	constructor( props ) {
		super( props );

		this.overlayRef = createRef();
		this.state = {
			selectedPreviewDeviceType: getLayouts()[ 0 ].value,
			renderDeviceType: getEditorDeviceWidth(),
		};
		window.addEventListener( 'resize', this.onResizeWindow.bind( this ) );
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
	};

	getPreviewDeviceType() {
		return this.props.previewDeviceType
			? this.props.previewDeviceType
			: this.state.selectedPreviewDeviceType;
	}

	setPreviewDeviceType = ( previewDeviceType ) => {
		if ( this.props.previewDeviceType ) {
			this.props.setPreviewDeviceType( previewDeviceType );
		} else {
			this.setState( { selectedPreviewDeviceType: previewDeviceType } );
		}
	};

	updateRenderDeviceType = () => {
		const renderDeviceType = getEditorDeviceWidth();
		this.setState( {
			renderDeviceType: renderDeviceType
		} );

	};

	componentDidUpdate = ( prevProps ) => {
		// After changing the preview mode, recompute the number of columns to render
		if ( prevProps.previewDeviceType !== this.props.previewDeviceType ) {
			this.updateRenderDeviceType();
		}
	};

	onResizeWindow = () => {
		this.updateRenderDeviceType();
	};

	onResize = ( column, adjustment ) => {
		const { attributes, columns } = this.props;
		const grid = new LayoutGrid( attributes, this.state.renderDeviceType, columns );
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
					<strong>{ __( 'Column', 'layout-grid' ) } { column + 1 }</strong>
					<div className="jetpack-layout-grid-settings__group">
						<TextControl
							type="number"
							label={ __( 'Offset', 'layout-grid' ) }
							value={ offset || 0 }
							min={ 0 }
							max={ getGridWidth( device ) - 1 }
							onChange={ ( value ) => this.onChangeOffset( column, device, value ) }
						/>
						<TextControl
							type="number"
							label={ __( 'Span', 'layout-grid' ) }
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
			setAttributes,
			updateAlignment,
			columnAttributes,
		} = this.props;
		const renderDeviceType = this.state.renderDeviceType;
		const selectedPreviewDevice = this.getPreviewDeviceType();
		const extra = getAsEditorCSS(
			renderDeviceType,
			columns,
			attributes,
			columnAttributes
		);
		const { gutterSize, addGutterEnds, verticalAlignment } = attributes;
		const layoutGrid = new LayoutGrid( attributes, renderDeviceType, columns );
		const classes = classnames(
			removeGridClasses( className ),
			extra,
			{
				'wp-block-jetpack-layout-tablet': renderDeviceType === 'Tablet',
				'wp-block-jetpack-layout-desktop': renderDeviceType === 'Desktop',
				'wp-block-jetpack-layout-mobile': renderDeviceType === 'Mobile',
				'wp-block-jetpack-layout-resizable': this.canResizeBreakpoint(
					renderDeviceType
				),
				[ `are-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
			},
			getGutterClasses( attributes )
		);

		if ( columns === 0 ) {
			return (
				<Placeholder
					icon="layout"
					label={ __( 'Choose Layout', 'layout-grid' ) }
					instructions={ __( 'Select a layout to start with:', 'layout-grid' ) }
					className={ classes }
				>
					<ul className="block-editor-inner-blocks__template-picker-options">
						{ getColumns().map( ( column ) => (
							<li key={ column.value }>
								<IconButton
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

		const toggleControl = (
			<ToggleControl
				label={ __( 'Add end gutters', 'layout-grid' ) }
				help={
					addGutterEnds ? __( 'Toggle off to remove the spacing left and right of the grid.', 'layout-grid' ) : __( 'Toggle on to add space left and right of the layout grid. ', 'layout-grid' )
				}
				checked={ addGutterEnds }
				onChange={ newValue => setAttributes( { addGutterEnds: newValue } )  }
			/>
		);

		return (
			<>
				<IsolatedEventContainer>
					<ResizeGrid
						className={ classes }
						onResize={ this.onResize }
						totalColumns={ getGridWidth( renderDeviceType ) }
						layoutGrid={ layoutGrid }
						isSelected={ isSelected }
					>
						<div className="wpcom-overlay-grid" ref={ this.overlayRef }>
							{ times( getGridWidth( renderDeviceType ) ).map( ( item ) => <div className="wpcom-overlay-grid__column" key={ item }></div> ) }
						</div>

						<InnerBlocks
							template={ null }
							templateLock="all"
							allowedBlocks={ ALLOWED_BLOCKS }
						/>

						<InspectorControls>
							<PanelBody title={ __( 'Layout', 'layout-grid' ) }>
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

								<p><em>{ __( 'Changing the number of columns will reset your layout and could remove content.', 'layout-grid' ) }</em></p>
							</PanelBody>

							<PanelBody title={ __( 'Responsive Breakpoints', 'layout-grid' ) }>
								<p><em>{ __( "Note that previewing your post will show your browser's breakpoint, not the currently selected one.", 'layout-grid' ) }</em></p>
								<ButtonGroup>
									{ getLayouts().map( ( layout ) => (
										<Button
											key={ layout.value }
											isPrimary={ layout.value === selectedPreviewDevice }
											onClick={ () => this.setPreviewDeviceType( layout.value ) }
										>
											{ layout.label }
										</Button>
									) ) }
								</ButtonGroup>

								{ this.renderDeviceSettings( columns, selectedPreviewDevice, attributes ) }
							</PanelBody>

							<PanelBody title={ __( 'Gutter', 'layout-grid' ) }>
								<p>{ __( 'Gutter size', 'layout-grid' ) }</p>

								<SelectControl
									value={ gutterSize }
									onChange={ newValue => setAttributes( { gutterSize: newValue, addGutterEnds: newValue === 'none' ? false : addGutterEnds } ) }
									options={ getGutterValues() }
								/>

								{ gutterSize === 'none' ? (
									<Disabled>
										{ toggleControl }
									</Disabled>
								) : toggleControl }

							</PanelBody>
						</InspectorControls>
					</ResizeGrid>
				</IsolatedEventContainer>

				<BlockControls>
					<BlockVerticalAlignmentToolbar
						onChange={ updateAlignment }
						value={ verticalAlignment }
					/>
					<Dropdown
						renderToggle={ ( { isOpen, onToggle } ) => (
							<ToolbarGroup>
								<Button
									aria-expanded={ isOpen }
									onClick={ onToggle }
									icon={ getLayouts().find( ( layout ) => layout.value === selectedPreviewDevice ).icon }
								/>
							</ToolbarGroup>
						) }
						renderContent={ ( { onClose } ) => (
							<MenuGroup>
								{ getLayouts().map( ( layout ) => (
									<MenuItem
										key={ layout.value }
										isSelected={ layout.value === selectedPreviewDevice }
										onClick={ () => this.setPreviewDeviceType( layout.value ) }
										icon={ layout.icon }
									>
										{ layout.label }
									</MenuItem>
								) ) }
							</MenuGroup>
						) }
					/>
				</BlockControls>
			</>
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
		/**
		 * Update all child Column blocks with a new vertical alignment setting
		 * based on whatever alignment is passed in. This allows change to parent
		 * to overide anything set on a individual column basis.
		 *
		 * @param {string} verticalAlignment the vertical alignment setting
		 */
		updateAlignment( verticalAlignment ) {
			const { clientId, setAttributes } = ownProps;
			const { updateBlockAttributes } = dispatch( 'core/block-editor' );
			const { getBlockOrder } = registry.select( 'core/block-editor' );

			// Update own alignment.
			setAttributes( { verticalAlignment } );

			// Update all child Column Blocks to match
			const innerBlockClientIds = getBlockOrder( clientId );
			innerBlockClientIds.forEach( ( innerBlockClientId ) => {
				updateBlockAttributes( innerBlockClientId, {
					verticalAlignment,
				} );
			} );
		},
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
				className: removeGridClasses( ownProps.attributes.className ),
			}, innerBlocks );

			replaceBlock( clientId, blockCopy );
		},
		setPreviewDeviceType( type ) {
			const {
				__experimentalSetPreviewDeviceType,
			} = dispatch( 'core/edit-post' );

			__experimentalSetPreviewDeviceType( type );
		}
	} ) ),
	withSelect( ( select, { clientId } ) => {
		const { getBlockOrder, getBlockCount, getBlocksByClientId } = select(
			'core/block-editor'
		);
		const { __experimentalGetPreviewDeviceType = null } = select( 'core/edit-post' );

		return {
			columns: getBlockCount( clientId ),
			columnAttributes: getBlockOrder( clientId ).map(
				( innerBlockClientId ) =>
					getBlocksByClientId( innerBlockClientId )[ 0 ].attributes
			),
			previewDeviceType: __experimentalGetPreviewDeviceType ? __experimentalGetPreviewDeviceType() : null,
		};
	} ),
] )( Edit );
