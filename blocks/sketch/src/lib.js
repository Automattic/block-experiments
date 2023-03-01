export const presets = [
	{
		size: 3,
		thinning: 0.3,
		smoothing: 0.83,
		streamline: 0.45,
	},
	{
		size: 14,
		thinning: 0.6,
		smoothing: 0.5,
		streamline: 0.75,
	},
	{
		size: 25,
		thinning: 0.5,
		smoothing: 0.5,
		streamline: 0.6,
	},
];

const average = (a, b) => (a + b) / 2


// Create SVG path data using the strokes from perfect-freehand.
export function getSvgPathFromStroke( points, closed = true ) {
	const len = points.length

	if (len < 4) {
	  return ``
	}

	let a = points[0]
	let b = points[1]
	const c = points[2]

	let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(2)},${b[1].toFixed(
	  2
	)} ${average(b[0], c[0]).toFixed(2)},${average(b[1], c[1]).toFixed(2)} T`

	for (let i = 2, max = len - 1; i < max; i++) {
	  a = points[i]
	  b = points[i + 1]
	  result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(2)} `
	}

	if (closed) {
	  result += 'Z'
	}

	return result
}
