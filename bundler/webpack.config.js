const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

defaultConfig.output.filename = 'index.js';

module.exports = defaultConfig;
