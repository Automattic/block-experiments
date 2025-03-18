const babelJest = require( 'babel-jest' ).default;

module.exports = babelJest.createTransformer( {
	presets: [ 
		'@wordpress/babel-preset-default',
		'@babel/preset-env' 
	],
	plugins: [ 
		'@babel/plugin-transform-modules-commonjs'
	],
} );
