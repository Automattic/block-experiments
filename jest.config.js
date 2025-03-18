/**
 * External dependencies
 */
const glob = require( 'glob' ).sync;

// Finds all packages which are transpiled with Babel to force Jest to use their source code.
const transpiledPackageNames = glob( 'packages/*/src/index.{js,ts,tsx}' ).map(
	( fileName ) => fileName.split( '/' )[ 1 ]
);

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
	fakeTimers: {
		enableGlobally: true,
	},
	verbose: true,
	transform: {
		'^.+\\.[jt]sx?$': 'babel-jest',
		'^.+\\.(css|scss)$': 'jest-transform-css',
		'\\.(jpg|jpeg|png|gif|webp|svg)$': 'jest-transform-file',
	},
	testEnvironment: 'jsdom',
	moduleNameMapper: {
		[ `@wordpress\\/(${ transpiledPackageNames.join( '|' ) })$` ]:
			'packages/$1/src',
		'.+\\.wasm$': '<rootDir>/test/unit/config/wasm-stub.js',
	},
	transformIgnorePatterns: [
		'/node_modules/(?!(docker-compose|yaml|uuid|preact|@preact|parsel-js)/)',
		'\\.pnp\\.[^\\/]+$',
	],
	resolver: require.resolve( './jest-resolver.js' ),
};
