/**
 * External dependencies
 */
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );

/**
 * WordPress dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,

	// Disable the clean plugin as it kills our CSS
	plugins: defaultConfig.plugins.filter(
		( plugin ) => ! ( plugin instanceof CleanWebpackPlugin )
	),
};
