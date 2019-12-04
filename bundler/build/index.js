const fs = require( 'fs' );
const path = require( 'path' );
const builder = require( './build-tools' );

const commandLine = process.argv.slice( 2 );
const configFile = commandLine.length > 0 ? path.join( 'bundler', 'bundles', commandLine[ 0 ].replace( '.json', '' ) + '.json' ) : null;

if ( ! configFile || ! fs.existsSync( configFile ) ) {
	console.error( 'node build.js <json file>' );
	process.exit( 1 );
}

const json = JSON.parse( fs.readFileSync( configFile, 'utf8' ) );

const PLUGIN_DIR = `plugin/${ json.resource }`;
const BUILD_DIR = 'build';

// Check values exist before proceeding
const required = [ 'blocks', 'version', 'name', 'description', 'resource' ];
required.forEach( key => {
	if ( json[ key ] === undefined ) {
		console.error( 'Missing key in JSON file: ' + key );
		process.exit( 1 );
	}
} );

console.log( 'Building plugin with config: ' + configFile );

// Build index.php
const indexPhp = builder.buildIndexPhp( json );

// Make index.js
const indexJs = builder.buildIndexJs( json.blocks, json.labs ? json.labs : false );

// Make style.scss
const styleScss = builder.buildStyle( json.blocks, 'Import front end styles for blocks', 'style' );

// Make editor.scss
const editorScss = builder.buildStyle( json.blocks, 'Import editor styles for blocks', 'editor' );

// Dump all files to disk
builder.storeFile( indexPhp, path.join( PLUGIN_DIR, 'index.php' ) );
builder.storeFile( indexJs, path.join( BUILD_DIR, 'src', 'index.js' ) );
builder.storeFile( styleScss, path.join( BUILD_DIR, 'style.scss' ) );
builder.storeFile( editorScss, path.join( BUILD_DIR, 'editor.scss' ) );

// Copy block PHP files
builder.copyBlocks( json, PLUGIN_DIR );

// And finally package it all up
builder.packageBundle( json );
