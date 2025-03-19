module.exports = {
	preset: '@wordpress/jest-preset-default',
	fakeTimers: {
		enableGlobally: true,
	},
	verbose: true,
	transformIgnorePatterns: [ 'node_modules/(?!(@wordpress|parsel-js)/)' ],
};
