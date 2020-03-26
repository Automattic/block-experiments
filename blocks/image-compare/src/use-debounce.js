/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';

export default (value, timeout) => {
	const [state, setState] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => setState(value), timeout);
		return () => clearTimeout(handler);
	}, [value]);

	return state;
}
