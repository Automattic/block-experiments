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
	BlockControls,
	BlockVerticalAlignmentToolbar,
} from '@wordpress/block-editor';
import { Component, createRef } from '@wordpress/element';
import {
	PanelBody,
	TextControl,
	ButtonGroup,
	Button,
	IconButton,
	Placeholder,
	ToggleControl,
	SelectControl,
	Disabled,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ENTER, SPACE } from '@wordpress/keycodes';
import { compose } from '@wordpress/compose';

/**
 * Internal dependencies
 */

import {
	getAsEditorCSS,
	removeGridClasses,
	getGutterClasses,
} from './css-classname';
import ColumnIcon from '../icons';
import {
	getLayouts,
	getColumns,
	DEVICE_BREAKPOINTS,
	getSpanForDevice,
	getOffsetForDevice,
	getGutterValues,
} from '../constants';
import { getGridWidth, getDefaultSpan } from './grid-defaults';
import ResizeGrid from './resize-grid';
import LayoutGrid from './layout-grid';
import PreviewDevice from './preview-device';

import {
	withUpdateAlignment,
	withUpdateColumns,
	withSetPreviewDeviceType,
	withColumns,
	withColumnAttributes,
	withPreviewDeviceType,
} from './higher-order';

const ALLOWED_BLOCKS = [ 'jetpack/layout-grid-column' ];
const MINIMUM_RESIZE_SIZE = 50; // Empirically determined to be a good size

class Edit extends Component {
	constructor( props ) {
		super( props );

		this.overlayRef = createRef();
		this.state = {
			inspectorDeviceType: 'Desktop',
			viewPort: 'Desktop',
		};
	}

	/*
	 * Change the layout (number of columns), resetting everything to the default
	 */
	onChangeLayout = ( columns ) => {
		const columnValues = {};

		for ( let pos = 0; pos < columns; pos++ ) {
			for (
				let device = 0;
				device < DEVICE_BREAKPOINTS.length;
				device++
			) {
				const defaultSpan = getDefaultSpan(
					DEVICE_BREAKPOINTS[ device ],
					columns,
					pos
				);

				columnValues[
					getSpanForDevice( pos, DEVICE_BREAKPOINTS[ device ] )
				] = defaultSpan;
				columnValues[
					getOffsetForDevice( pos, DEVICE_BREAKPOINTS[ device ] )
				] = 0;
			}
		}

		this.props.updateColumns( this.props.columns, columns, columnValues );
	};

	onResize = ( column, adjustment ) => {
		const { attributes, columns } = this.props;
		const grid = new LayoutGrid(
			attributes,
			this.getPreviewMode(),
			columns
		);
		const adjustedGrid = grid.getAdjustedGrid( column, adjustment );

		if ( adjustedGrid ) {
			this.adjustGrid( adjustedGrid );
		}
	};

	onChangeSpan = ( column, device, value ) => {
		const { attributes, columns } = this.props;
		const grid = new LayoutGrid( attributes, device, columns );
		const adjustedGrid = grid.getAdjustedGrid( column, {
			span: parseInt( value, 10 ),
		} );

		if ( adjustedGrid ) {
			this.adjustGrid( adjustedGrid );
		}
	};

	onChangeOffset = ( column, device, value ) => {
		const { attributes, columns } = this.props;
		const grid = new LayoutGrid( attributes, device, columns );
		const adjustedGrid = grid.getAdjustedGrid( column, {
			start: grid.convertOffsetToStart( column, parseInt( value, 10 ) ),
		} );

		if ( adjustedGrid ) {
			this.adjustGrid( adjustedGrid );
		}
	};

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
			const span =
				grid.getSpan( column ) ||
				getDefaultSpan( device, columns, column );
			const offset = grid.getOffset( column ) || 0;

			settings.push(
				<div className="jetpack-layout-grid-settings" key={ column }>
					<strong>
						{ __( 'Column', 'layout-grid' ) } { column + 1 }
					</strong>
					<div className="jetpack-layout-grid-settings__group">
						<TextControl
							type="number"
							label={ __( 'Offset', 'layout-grid' ) }
							value={ offset || 0 }
							min={ 0 }
							max={ getGridWidth( device ) - 1 }
							onChange={ ( value ) =>
								this.onChangeOffset( column, device, value )
							}
						/>
						<TextControl
							type="number"
							label={ __( 'Span', 'layout-grid' ) }
							value={ span }
							min={ 1 }
							max={ getGridWidth( device ) }
							onChange={ ( value ) =>
								this.onChangeSpan( column, device, value )
							}
						/>
					</div>
				</div>
			);
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

	updateInspectorDevice( device ) {
		this.setState( { inspectorDeviceType: device } );

		// Only update if not on mobile
		if ( this.state.viewPort !== 'Mobile' ) {
			this.props.setPreviewDeviceType( device );
		}
	}

	getPreviewMode() {
		// If we're rendering within a pattern preview, use the desktop layout for the preview.
		if ( this.props.isBlockOrPatternPreview ) {
			return 'Desktop';
		}

		// If we're on desktop, or the preview is set to mobile, then return the preview mode
		if (
			this.state.viewPort === 'Desktop' ||
			this.props.previewDeviceType === 'Mobile'
		) {
			return this.props.previewDeviceType;
		}

		// Return something appropriate for the viewport (mobile or tablet)
		return this.state.viewPort;
	}

	getInspectorMode() {
		if ( this.state.viewPort === 'Desktop' ) {
			return this.props.previewDeviceType;
		}

		// Return something appropriate for the viewport (mobile or tablet)
		return this.state.inspectorDeviceType;
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
		const { viewPort } = this.state;
		const previewMode = this.getPreviewMode();
		const inspectorDeviceType = this.getInspectorMode();
		const extra = getAsEditorCSS(
			previewMode,
			columns,
			attributes,
			columnAttributes
		);
		const { gutterSize, addGutterEnds, verticalAlignment } = attributes;
		const layoutGrid = new LayoutGrid( attributes, previewMode, columns );
		const classes = classnames(
			removeGridClasses( className ).replace(
				'layout-grid',
				'layout-grid-editor'
			),
			'wp-block-jetpack-editor',
			extra,
			{
				'wp-block-jetpack-layout-tablet': previewMode === 'Tablet',
				'wp-block-jetpack-layout-desktop': previewMode === 'Desktop',
				'wp-block-jetpack-layout-mobile': previewMode === 'Mobile',
				'wp-block-jetpack-layout-resizable': this.canResizeBreakpoint(
					previewMode
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
					instructions={ __(
						'Select a layout to start with:',
						'layout-grid'
					) }
					className={ classes }
				>
					<ul className="block-editor-inner-blocks__template-picker-options">
						{ getColumns().map( ( column ) => (
							<li key={ column.value }>
								<IconButton
									isSecondary
									icon={
										<ColumnIcon columns={ column.value } />
									}
									onClick={ () =>
										this.onChangeLayout( column.value )
									}
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
					addGutterEnds
						? __(
								'Toggle off to remove the spacing left and right of the grid.',
								'layout-grid'
						  )
						: __(
								'Toggle on to add space left and right of the layout grid. ',
								'layout-grid'
						  )
				}
				checked={ addGutterEnds }
				onChange={ ( newValue ) =>
					setAttributes( { addGutterEnds: newValue } )
				}
			/>
		);

		return (
			<>
				<PreviewDevice
					currentViewport={ viewPort }
					updateViewport={ ( newPort ) =>
						this.setState( {
							viewPort: newPort,
							inspectorDeviceType: newPort,
						} )
					}
				/>

				<ResizeGrid
					className={ classes }
					onResize={ this.onResize }
					totalColumns={ getGridWidth( previewMode ) }
					layoutGrid={ layoutGrid }
					isSelected={ isSelected }
				>
					<div className="wpcom-overlay-grid" ref={ this.overlayRef }>
						{ times( getGridWidth( previewMode ) ).map(
							( item ) => (
								<div
									className="wpcom-overlay-grid__column"
									key={ item }
								></div>
							)
						) }
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
											'block-editor-block-styles__item',
											{
												'is-active':
													columns === column.value,
											}
										) }
										onClick={ () =>
											this.onChangeLayout( column.value )
										}
										onKeyDown={ ( event ) => {
											if (
												ENTER === event.keyCode ||
												SPACE === event.keyCode
											) {
												event.preventDefault();
												this.onChangeLayout(
													column.value
												);
											}
										} }
										role="button"
										tabIndex="0"
										aria-label={ column.label }
									>
										<div className="block-editor-block-styles__item-preview">
											<ColumnIcon
												columns={ column.value }
											/>
										</div>
										<div className="editor-block-styles__item-label block-editor-block-styles__item-label">
											{ column.label }
										</div>
									</div>
								) ) }
							</div>

							<p>
								<em>
									{ __(
										'Changing the number of columns will reset your layout and could remove content.',
										'layout-grid'
									) }
								</em>
							</p>
						</PanelBody>

						<PanelBody
							title={ __(
								'Responsive Breakpoints',
								'layout-grid'
							) }
						>
							<p>
								<em>
									{ __(
										"Note that previewing your post will show your browser's breakpoint, not the currently selected one.",
										'layout-grid'
									) }
								</em>
							</p>
							<ButtonGroup>
								{ getLayouts().map( ( layout ) => (
									<Button
										key={ layout.value }
										isPrimary={
											layout.value === inspectorDeviceType
										}
										onClick={ () =>
											this.updateInspectorDevice(
												layout.value
											)
										}
									>
										{ layout.label }
									</Button>
								) ) }
							</ButtonGroup>

							{ this.renderDeviceSettings(
								columns,
								inspectorDeviceType,
								attributes
							) }
						</PanelBody>

						<PanelBody title={ __( 'Gutter', 'layout-grid' ) }>
							<p>{ __( 'Gutter size', 'layout-grid' ) }</p>

							<SelectControl
								value={ gutterSize }
								onChange={ ( newValue ) =>
									setAttributes( {
										gutterSize: newValue,
										addGutterEnds:
											newValue === 'none'
												? false
												: addGutterEnds,
									} )
								}
								options={ getGutterValues() }
							/>

							{ gutterSize === 'none' ? (
								<Disabled>{ toggleControl }</Disabled>
							) : (
								toggleControl
							) }
						</PanelBody>
					</InspectorControls>
				</ResizeGrid>

				<BlockControls>
					<BlockVerticalAlignmentToolbar
						onChange={ updateAlignment }
						value={ verticalAlignment }
					/>
				</BlockControls>
			</>
		);
	}
}

function MaybeDisabledEdit( props ) {
	return (
		<Disabled.Consumer>
			{ ( isDisabled ) => {
				return (
					<Edit { ...props } isBlockOrPatternPreview={ isDisabled } />
				);
			} }
		</Disabled.Consumer>
	);
}

export default compose( [
	withUpdateAlignment(),
	withUpdateColumns(),
	withSetPreviewDeviceType(),
	withColumns(),
	withColumnAttributes(),
	withPreviewDeviceType(),
] )( MaybeDisabledEdit );
