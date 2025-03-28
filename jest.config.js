module.exports = {
	preset: '@wordpress/jest-preset-default',
	fakeTimers: {
		enableGlobally: true,
	},
	verbose: true,
	setupFilesAfterEnv: [ '<rootDir>/config/jest-before.js' ],
	transformIgnorePatterns: [ 'node_modules/(?!(@wordpress|parsel-js)/)' ],
};
