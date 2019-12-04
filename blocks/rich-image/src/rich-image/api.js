/**
 * WordPress dependencies
 */

import apiFetch from '@wordpress/api-fetch';

function getExternalRequestAction( attrs ) {
	if ( attrs.imageRotation !== undefined ) {
		return {
			action: 'rotate',
			angle: attrs.imageRotation,
		};
	}

	if ( attrs.imageFlipV !== undefined ) {
		return {
			action: 'flip_v',
		};
	}

	if ( attrs.imageFlipH !== undefined ) {
		return {
			action: 'flip_h',
		};
	}

	if ( attrs.cropX !== undefined ) {
		return {
			action: 'crop',
			...attrs,
		};
	}

	return { action: 'nothing' };
}

// Note this always happens with the original media ID. This way the rotation is consistent (otherwise we rotate an already rotated image)
export default function richImageRequest( id, attrs ) {
	const action = getExternalRequestAction( attrs );

	return apiFetch( {
		path: `pages/v1/richimage/${ id }`,
		headers: {
			'Content-type': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify( action ),
	} );
};
