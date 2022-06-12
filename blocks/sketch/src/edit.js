/**
 * External dependencies
 */
import getStroke from 'perfect-freehand';

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

const MIN_HEIGHT = 200;
const MAX_HEIGHT = 1000;

const Edit = ( { attributes, isSelected, setAttributes } ) => {
	const { strokes, height, title } = attributes;
	const [ currentMark, setCurrentMark ] = useState();
	const [ preset, setPreset ] = useState( 1 );
	const [ isResizing, setIsResizing ] = useState( false );
	const [ color, setColor ] = useState( '#000' );
	const ref = useRef( null );
	const blockProps = useBlockProps( {
		className: 'wp-block-a8c-sketch',
		ref,
	} );
	function handlePointerDown( e ) {
		const { left: x, top: y } = ref.current.getBoundingClientRect();
		if ( ! isSelected ) {
			return;
		}
		setCurrentMark( {
			type: e.pointerType,
			points: [ [ e.clientX - x, e.clientY - y, e.pressure ] ],
		} );
	}

	function handlePointerMove( e ) {
		const { left: x, top: y } = ref.current.getBoundingClientRect();

		if ( isSelected && currentMark && e.buttons === 1 ) {
			e.preventDefault();
			setCurrentMark( {
				...currentMark,
				points: [
					...currentMark.points,
					[ e.clientX - x, e.clientY - y, e.pressure ],
				],
			} );
		}
	}
	function handlePointerUp() {
		if ( isSelected && currentMark ) {
			setAttributes( {
				strokes: [
					...strokes,
					{
						stroke: getStroke( currentMark.points, {
							...presets[ preset ],
							simulatePressure: currentMark.type !== 'pen',
						} ),
						color,
					},
				],
			} );
			setCurrentMark( undefined );
		}
	}

	const clear = () => setAttributes( { strokes: [], height: 450 } );

	const handleOnResizeStart = () => {
		setIsResizing( true );
	};

	const setTitle = ( newTitle ) => setAttributes( { title: newTitle } );

	const handleOnResizeStop = ( event, direction, elt, delta ) => {
		const sketchHeight = Math.min(
			parseInt( height + delta.height, 10 ),
			MAX_HEIGHT
		);
		setAttributes( {
			height: sketchHeight,
		} );
		setIsResizing( false );
	};

	const currentStroke = currentMark && {
		stroke: getStroke( currentMark.points, {
			...presets[ preset ],
			simulatePressure: currentMark.type !== 'pen',
		} ),
		color,
	};
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
					handlePointerDown={ handlePointerDown }
					handlePointerMove={ handlePointerMove }
					handlePointerUp={ handlePointerUp }
					strokes={ strokes }
					currentStroke={ currentStroke }
					title={ title }
				/>
				</ResizableBox>
			</figure>
		</>
	);
};

export const Freehand = ( {
	currentStroke,
	strokes,
	handlePointerDown,
	handlePointerMove,
	handlePointerUp,
	title,
} ) => (
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

export const StrokePath = ( { stroke } ) => {
	const color = stroke.color ?? '#f00';
	return <path fill={ color } d={ getSvgPathFromStroke( stroke.stroke ) } />;
};

// export default Edit;
export default Edit;
