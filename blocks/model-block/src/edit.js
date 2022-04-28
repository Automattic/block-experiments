/**
 * WordPress dependencies
 */
import { __, isRTL } from '@wordpress/i18n';
import {
	BaseControl,
	ExternalLink,
	PanelBody,
	ResizableBox,
	TextareaControl,
	ToggleControl,
	Flex,
	FlexItem,
	withNotices,
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useReducedMotion, useInstanceId } from '@wordpress/compose';
import {
	BlockControls,
	BlockIcon,
	InspectorControls,
	MediaPlaceholder,
	MediaReplaceFlow,
	useBlockProps,
} from '@wordpress/block-editor';
import { useEffect, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { icon } from './icon';
import {
	PC_WIDTH_DEFAULT,
	PX_WIDTH_DEFAULT,
	PC_HEIGHT_DEFAULT,
	PX_HEIGHT_DEFAULT,
	MIN_WIDTH,
	MIN_WIDTH_UNIT,
	MIN_HEIGHT,
	MIN_HEIGHT_UNIT,
} from './utils.js';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export function Edit( {
	attributes,
	setAttributes,
	isSelected,
	noticeUI,
	toggleSelection,
} ) {
	const {
		id,
		src,
		alt,
		width,
		height,
		autoRotate,
		cameraOrbit,
		fieldOfView,
		widthUnit,
		heightUnit,
		align,
	} = attributes;
	const modelViewerRef = useRef( null );

	const [ initialCameraOrbit ] = useState( cameraOrbit );
	const [ initialFieldOfView ] = useState( fieldOfView );

	useEffect( () => {
		if ( ! modelViewerRef.current ) {
			return;
		}

		modelViewerRef.current.addEventListener( 'camera-change', ( event ) => {
			if ( 'user-interaction' === event.detail.source ) {
				const newFieldOfView = event.currentTarget.getFieldOfView();
				const cameraOrbitString = event.currentTarget
					.getCameraOrbit()
					.toString();

				setAttributes( {
					cameraOrbit: cameraOrbitString,
					fieldOfView: newFieldOfView,
				} );
			}
		} );
	}, [ modelViewerRef ] );

	function onSelectModel( media ) {
		if ( ! media || ! media.url ) {
			setAttributes( {
				id: undefined,
				src: undefined,
				width: undefined,
				height: undefined,
			} );
			return;
		}

		setAttributes( {
			src: media.url,
			id: media.id,
		} );
	}

	function onSelectURL( newSrc ) {
		if ( newSrc !== src ) {
			setAttributes( { src: newSrc, id: undefined } );
		}
	}

	function onUploadError( message ) {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( message );
	}

	function updateAlt( newAlt ) {
		setAttributes( { alt: newAlt } );
	}

	function toggleAutoRotate( newAutoRotate ) {
		setAttributes( { autoRotate: newAutoRotate } );
	}

	function onResizeStart( event, direction, elt ) {
		setAttributes( {
			width: parseInt( elt.offsetWidth, 10 ),
			widthUnit: 'px',
			height: parseInt( elt.offsetHeight, 10 ),
			heightUnit: 'px',
		} );
		toggleSelection( false );
	}

	function onResizeStop( event, direction, elt, delta ) {
		setAttributes( {
			width: parseInt( width + delta.width, 10 ),
			height: parseInt( height + delta.height, 10 ),
		} );
		toggleSelection( true );
	}

	function onDimensionChange( dimension, value ) {
		const filteredValue =
			[ `${ dimension }Unit` ] === '%' && parseInt( value, 10 ) > 100
				? 100
				: value;

		setAttributes( {
			[ dimension ]: parseInt( filteredValue, 10 ),
		} );
	}

	function onDimensionUnitChange( dimension, pcDefault, pxDefault, value ) {
		setAttributes( {
			[ dimension ]: '%' === value ? pcDefault : pxDefault,
			[ `${ dimension }Unit` ]: value,
		} );
	}

	const isReducedMotion = useReducedMotion();

	const widthUnits = useCustomUnits( {
		availableUnits: [ '%', 'px' ],
		defaultValues: { '%': PC_WIDTH_DEFAULT, px: PX_WIDTH_DEFAULT },
	} );
	const heightUnits = useCustomUnits( {
		availableUnits: [ '%', 'px' ],
		defaultValues: { '%': PC_HEIGHT_DEFAULT, px: PX_HEIGHT_DEFAULT },
	} );

	const unitControlWidthInstanceId = useInstanceId( UnitControl );
	const unitControlWidthInputId = `a8c-block-model-viewer-width-${ unitControlWidthInstanceId }`;
	const unitControlHeightInstanceId = useInstanceId( UnitControl );
	const unitControlHeightInputId = `a8c-block-model-viewer-height-${ unitControlHeightInstanceId }`;

	const blockProps = useBlockProps();

	if ( ! src ) {
		return (
			<div { ...blockProps }>
				<MediaPlaceholder
					icon={ <BlockIcon icon={ icon } /> }
					onSelect={ onSelectModel }
					onSelectURL={ onSelectURL }
					accept="application/octet-stream"
					allowedTypes="model"
					value={ attributes }
					notices={ noticeUI }
					onError={ onUploadError }
					labels={ {
						title: __( '3D Model' ),
						instructions: __(
							'Show interactive 3D models. Add .gltf or .glb files.'
						),
					} }
				/>
			</div>
		);
	}

	let showRightHandle =
		! align ||
		align === 'center' ||
		( isRTL() ? align === 'right' : align === 'left' );
	let showLeftHandle =
		align === 'center' ||
		( isRTL() ? align === 'left' : align === 'right' );

	// React stringifies custom properties, so use object destructuring to disable auto-rotate.
	// See https://github.com/facebook/react/issues/9230
	const autoRotateAttr =
		autoRotate && ! isReducedMotion ? { 'auto-rotate': true } : {};

	return (
		<>
			<BlockControls group="other">
				<MediaReplaceFlow
					mediaId={ id }
					mediaURL={ src }
					allowedTypes="model"
					accept={ [ 'application/octet-stream' ] }
					onSelect={ onSelectModel }
					onSelectURL={ onSelectURL }
					onError={ onUploadError }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) }>
					<BaseControl>
						<Flex>
							<FlexItem>
								<BaseControl
									label={ __( 'Width' ) }
									id={ unitControlWidthInputId }
								>
									<UnitControl
										id={ unitControlWidthInputId }
										min={ `${ MIN_WIDTH }${ MIN_WIDTH_UNIT }` }
										onChange={ ( newWidth ) =>
											onDimensionChange(
												'width',
												newWidth
											)
										}
										onUnitChange={ ( newUnit ) =>
											onDimensionUnitChange(
												'width',
												PC_WIDTH_DEFAULT,
												PX_WIDTH_DEFAULT,
												newUnit
											)
										}
										value={ `${ width }${ widthUnit }` }
										units={ widthUnits }
									/>
								</BaseControl>
							</FlexItem>
							<FlexItem>
								<BaseControl
									label={ __( 'Height' ) }
									id={ unitControlHeightInputId }
								>
									<UnitControl
										id={ unitControlHeightInputId }
										min={ `${ MIN_HEIGHT }${ MIN_HEIGHT_UNIT }` }
										onChange={ ( newHeight ) =>
											onDimensionChange(
												'height',
												newHeight
											)
										}
										onUnitChange={ ( newUnit ) =>
											onDimensionUnitChange(
												'height',
												PC_HEIGHT_DEFAULT,
												PX_HEIGHT_DEFAULT,
												newUnit
											)
										}
										value={ `${ height }${ heightUnit }` }
										units={ heightUnits }
									/>
								</BaseControl>
							</FlexItem>
						</Flex>
					</BaseControl>

					<ToggleControl
						label={ __( 'Auto rotate' ) }
						onChange={ toggleAutoRotate }
						checked={ autoRotate }
						help={
							autoRotate &&
							__(
								'Rotation will always be disabled for users that prefer reduced motion.'
							)
						}
					/>

					<TextareaControl
						label={ __( 'Alternative text' ) }
						value={ alt }
						onChange={ updateAlt }
						help={
							<>
								<ExternalLink href="https://www.w3.org/WAI/tutorials/images/decision-tree">
									{ __( 'Describe the 3D model.' ) }
								</ExternalLink>
								<br />
								{ __( 'Leave empty if decorative.' ) }
							</>
						}
					/>
				</PanelBody>
			</InspectorControls>
			<figure { ...blockProps }>
				<ResizableBox
					size={ {
						height:
							height && heightUnit
								? `${ height }${ heightUnit }`
								: 'auto',
						width:
							width && widthUnit
								? `${ width }${ widthUnit }`
								: 'auto',
					} }
					showHandle={ isSelected }
					lockAspectRatio
					enable={ {
						top: false,
						right: showRightHandle,
						bottom: true,
						left: showLeftHandle,
					} }
					onResizeStart={ onResizeStart }
					onResizeStop={ onResizeStop }
				>
					<model-viewer
						className="wp-block-a8c-model-viewer-component"
						ref={ modelViewerRef }
						alt={ alt }
						src={ src }
						camera-orbit={ initialCameraOrbit }
						field-of-view={ initialFieldOfView }
						ar
						ar-modes="webxr scene-viewer quick-look"
						seamless-poster
						shadow-intensity="1"
						camera-controls
						enable-pan
						{ ...autoRotateAttr }
					></model-viewer>
				</ResizableBox>
			</figure>
		</>
	);
}

export default withNotices( Edit );
