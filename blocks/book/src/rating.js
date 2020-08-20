import { useState } from 'react';
import { Icon, starFilled, starEmpty, starHalf } from '@wordpress/icons';

function isPastHalf( { currentTarget, clientX } ) {
	const boundingClient = currentTarget.getBoundingClientRect();
	const mouseAt = Math.round( Math.abs( clientX - boundingClient.left ) );

	return mouseAt > boundingClient.width / 2;
}

export default function Rating( { isEditing = false, rating = 0, onRate } ) {
	const [ selectedRating, setSelectedRating ] = useState( rating );
	const [ hovering, setHovering ] = useState( false );

	const handleHover = ( index ) => ( event ) => {
		if ( ! isEditing ) {
			return;
		}

		setHovering( true );

		const selectedValue = index + 1;
		const newHoveredRating = isPastHalf( event )
			? selectedValue
			: Math.max( selectedValue - 0.5, 1 );

		setSelectedRating( newHoveredRating );
	};

	const handleMouseOut = () => setHovering( false );

	const handleRating = () => {
		if ( onRate ) {
			onRate( selectedRating );
		}
	};

	const getStar = ( index ) => {
		const step = index + 1;
		const usedRating = hovering ? selectedRating : rating;

		// If we're on a step below or equal to the rating, the star should be filled.
		if ( step <= usedRating ) {
			return starFilled;
		}

		/**
		 * If we're on a step over the rating rounded up to the closest integer,
		 * the star should be empty.
		 */
		if ( step > Math.ceil( usedRating ) ) {
			return starEmpty;
		}

		/**
		 * Otherwise, we're in-between, which only happens if the rating is not
		 * an integer, so we print a half star.
		 */
		return starHalf;
	};

	return (
		<div>
			{ Array.from( { length: 5 } ).map( ( _, index ) => (
				<Icon
					role="button"
					key={ index }
					icon={ getStar( index ) }
					onClick={ handleRating }
					onMouseOver={ handleHover( index ) }
					onMouseOut={ handleMouseOut }
				/>
			) ) }
		</div>
	);
}
