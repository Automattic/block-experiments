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

const Edit = ( { attributes, isSelected, setAttributes } ) => {
	const { strokes } = attributes;
	const [ currentMark, setCurrentMark ] = useState();
	const [ preset, setPreset ] = useState( 1 );
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
	const clear = () => setAttributes( { strokes: [] } );

	const currentStroke = currentMark && {
		stroke: getStroke( currentMark.points, {
			...presets[ preset ],
			simulatePressure: currentMark.type !== 'pen',
		} ),
		color,
	};
	return (
		<div { ...blockProps }>
			<Controls
				clear={ clear }
				color={ color }
				setColor={ setColor }
				preset={ preset }
				setPreset={ setPreset }
			/>
			<figure>
				<Freehand
					handlePointerDown={ handlePointerDown }
					handlePointerMove={ handlePointerMove }
					handlePointerUp={ handlePointerUp }
					strokes={ strokes }
					currentStroke={ currentStroke }
				/>
			</figure>
		</div>
	);
};

export const Freehand = ( {
	currentStroke,
	strokes,
	handlePointerDown,
	handlePointerMove,
	handlePointerUp,
} ) => (
	<svg
		onPointerDown={ handlePointerDown }
		onPointerMove={ handlePointerMove }
		onPointerUp={ handlePointerUp }
		style={ { touchAction: 'none' } }
	>
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
