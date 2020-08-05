// The Gutenberg preset prevents jest-transform-css from working, so re-define the important bits here
module.exports = {
	modulePaths: [ '<rootDir>' ],
	setupFiles: [
		require.resolve(
			'@wordpress/jest-preset-default/scripts/setup-globals.js'
		),
	],
	setupFilesAfterEnv: [
		require.resolve(
			'@wordpress/jest-preset-default/scripts/setup-test-framework.js'
		),
		'./config/jest-before.js',
	],
	testMatch: [
		'**/__tests__/**/*.[jt]s',
		'**/test/*.[jt]s',
		'**/?(*.)test.[jt]s',
	],
	testPathIgnorePatterns: [ '/node_modules/', '<rootDir>/wordpress/' ],
	timers: 'fake',
	verbose: true,
	transform: {
		'^.+\\.[jt]sx?$': 'babel-jest',
		'^.+\\.(css|scss)$': 'jest-transform-css',
		'\\.(jpg|jpeg|png|gif|webp|svg)$': 'jest-transform-file',
	}
};
