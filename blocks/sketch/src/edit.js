/**
 * External dependencies
 */
import getStroke from 'perfect-freehand';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { presets, getSvgPathFromStroke } from './lib';
import Controls from './controls';
/**
 * WordPress dependencies
 */
import { useState, useRef } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import { ResizableBox } from '@wordpress/components';

const MIN_HEIGHT = 1;
const MAX_HEIGHT = 1000;

const Edit = ( { attributes, isSelected, setAttributes } ) => {
	const { strokes, height, title } = attributes;
	const [ preset, setPreset ] = useState( 1 );
	const [ isResizing, setIsResizing ] = useState( false );
	const [ color, setColor ] = useState( '#000' );
	const ref = useRef( null );
	const blockProps = useBlockProps( {
		className: 'wp-block-a8c-sketch',
		ref,
	} );

	const addStroke = useCallback( ( stroke ) => {
		setAttributes( {
			strokes: [
				...strokes,
				{
					stroke,
					color,
				},
			],
		} );
	}, [ setAttributes, strokes, color ] );

	const clear = useCallback(
		() => setAttributes( { strokes: [] } ), [
		setAttributes
	] );

	const handleOnResizeStart = useCallback( () => {
		setIsResizing( true );
	}, [ setIsResizing ] );

	const setTitle = useCallback( ( newTitle ) => setAttributes( { title: newTitle } ), [ setAttributes ] );

	const handleOnResizeStop = useCallback( ( event, direction, elt, delta ) => {
		const sketchHeight = Math.min(
			parseInt( height + delta.height, 10 ),
			MAX_HEIGHT
		);
		setAttributes( {
			height: sketchHeight,
		} );
		setIsResizing( false );
	}, [ height, setAttributes, setIsResizing ] );

	return (
		<>
			<Controls
				clear={ clear }
				color={ color }
				setColor={ setColor }
				preset={ preset }
				setPreset={ setPreset }
				isEmpty={ ! strokes.length }
				title={ title }
				setTitle={ setTitle }
				blockRef={ ref }
				attributes={ attributes }
			/>
			<figure { ...blockProps }>
			<ResizableBox
				size={ {
					height,
				} }
				minHeight={ MIN_HEIGHT }
				enable={ {
					top: false,
					right: false,
					bottom: true,
					left: false,
					topRight: false,
					bottomRight: false,
					bottomLeft: false,
					topLeft: false,
				} }
				onResizeStart={ handleOnResizeStart }
				onResizeStop={ handleOnResizeStop }
				showHandle={ isSelected }
				__experimentalShowTooltip={ true }
				__experimentalTooltipProps={ {
					axis: 'y',
					position: 'bottom',
					isVisible: isResizing,
				} }
			>
				<Freehand
					onNewStroke={ addStroke }
					color={ color }
					containerRef={ ref }
					editing={ isSelected }
					preset={ preset }
					strokes={ strokes }
					title={ title }
				/>
				</ResizableBox>
			</figure>
		</>
	);
};

export const Freehand = ( {
	color,
	containerRef,
	editing,
	onNewStroke,
	preset,
	strokes,
	title,
} ) => {
	const [ currentMark, setCurrentMark ] = useState();

	const currentStroke = currentMark && {
		stroke: getStroke( currentMark.points, {
			...presets[ preset ],
			simulatePressure: currentMark.type !== 'pen',
		} ),
		color,
	};

	const handlePointerDown = useCallback( ( e ) => {

		const { left: x, top: y } = containerRef.current.getBoundingClientRect();
		if ( ! editing ) {
			return;
		}
		const mark = {
			type: e.pointerType,
			points: [ [ e.clientX - x, e.clientY - y, e.pressure ] ],
		};
		setCurrentMark( mark );
	}, [ containerRef, editing, setCurrentMark ] );

	const handlePointerMove = useCallback( ( e ) => {
		const { left: x, top: y } = containerRef.current.getBoundingClientRect();

		if ( editing && currentMark && e.buttons === 1 ) {
			const mark =  {
				...currentMark,
				points: [
					...currentMark.points,
					[ e.clientX - x, e.clientY - y, e.pressure ],
				],
			}
			e.preventDefault();
			setCurrentMark( mark );
		}
	}, [ containerRef, editing, currentMark, setCurrentMark] );

	const handlePointerUp = useCallback ( () => {
		if ( editing && currentMark ) {
			const stroke = getStroke( currentMark.points, {
				...presets[ preset ],
				simulatePressure: currentMark.type !== 'pen',
			} );
			onNewStroke( stroke );
			setCurrentMark( undefined );
		}
	}, [ currentMark, editing, onNewStroke, setCurrentMark, preset ] );

	return (
		<svg
			onPointerDown={ handlePointerDown }
			onPointerMove={ handlePointerMove }
			onPointerUp={ handlePointerUp }
			style={ { touchAction: 'none' } }
			role="img"
		>
			{ title && <title>{ title }</title> }
			{ strokes.map( ( stroke, i ) => (
				<StrokePath key={ i } stroke={ stroke } />
			) ) }

			{ currentStroke && <StrokePath stroke={ currentStroke } /> }
		</svg>
	);
};

export const StrokePath = ( { stroke } ) => {
	const color = stroke.color ?? '#f00';
	return <path fill={ color } d={ getSvgPathFromStroke( stroke.stroke ) } />;
};

// export default Edit;
export default Edit;
