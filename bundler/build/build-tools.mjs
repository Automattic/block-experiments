import path from 'path';
import fs from 'fs-extra';
import { camelcase, spinalcase } from 'stringcase';

// Create an async function to handle the replace operations
async function replaceInFile( options ) {
	const { default: replace } = await import( 'replace-in-file' );
	return replace.sync( options );
}

function buildIndexPhp( {
	blocks,
	version,
	name,
	description,
	resource,
	locale,
} ) {
	let contents = fs.readFileSync(
		path.join( 'bundler', 'template', 'index.php' ),
		'utf-8'
	);

	contents = contents.replace( /\[VERSION\]/g, version );
	contents = contents.replace( /\[NAME\]/g, name );
	contents = contents.replace( /\[DESCRIPTION\]/g, description );
	contents = contents.replace( /\[RESOURCE\]/g, spinalcase( resource ) );
	contents = contents.replace(
		/\[LOCALE\]/g,
		spinalcase( locale || resource )
	);
	contents += '\n';

	for ( let index = 0; index < blocks.length; index++ ) {
		contents +=
			"include_once __DIR__ . '/blocks/" + blocks[ index ] + ".php';\n";

		if (
			fs.existsSync(
				path.join( 'blocks', blocks[ index ], 'rest-api.php' )
			)
		) {
			contents += "include_once __DIR__ . '/blocks/rest-api.php';\n";
		}
	}

	return contents;
}

function buildIndexJs( blocks, isLabs ) {
	let contents = fs.readFileSync(
		path.join( 'bundler', 'template', 'index.js' ),
		'utf-8'
	);

	contents += '\n';

	for ( let index = 0; index < blocks.length; index++ ) {
		contents +=
			'import * as ' +
			camelcase( blocks[ index ] ) +
			" from '../../blocks/" +
			blocks[ index ] +
			"/src';\n";
	}

	contents +=
		'\n// Instantiate the blocks, adding them to our block category\n';

	for ( let index = 0; index < blocks.length; index++ ) {
		contents += camelcase( blocks[ index ] ) + '.registerBlock();\n';
	}

	return contents;
}

function buildStyle( blocks, title, fileType ) {
	let contents = '// ' + title + '\n';

	for ( let index = 0; index < blocks.length; index++ ) {
		const styleName = `./blocks/${ blocks[ index ] }/${ fileType }.scss`;

		if ( fs.existsSync( styleName ) ) {
			contents += `@import '${ styleName }';\n`;
		}
	}

	return contents;
}

function storeFile( contents, fileName ) {
	fs.mkdirp( path.dirname( fileName ) )
		.then( function () {
			fs.writeFileSync( fileName, contents );
		} )
		.catch( function () {
			console.error( 'Unable to create directory: ' + fileName );
		} );
}

function copyExtra( sourceDir, targetDir ) {
	const manifest = path.join( sourceDir, 'index.json' );

	if ( fs.existsSync( manifest ) ) {
		const json = JSON.parse( fs.readFileSync( manifest, 'utf8' ) );

		for ( let index = 0; index < json.length; index++ ) {
			fs.copySync(
				path.join( sourceDir, json[ index ] ),
				path.join( targetDir, json[ index ] )
			);
		}
	}
}

async function copyBlocks( { blocks, resource }, targetDir ) {
	for ( let index = 0; index < blocks.length; index++ ) {
		const sourceFile = path.join( 'blocks', blocks[ index ], 'index.php' );
		const targetFile = path.join(
			targetDir,
			'blocks',
			blocks[ index ] + '.php'
		);
		const manifest = path.join( 'blocks', blocks[ index ] );

		try {
			await fs.mkdirp( path.dirname( targetFile ) );
			fs.copySync( sourceFile, targetFile );

			await replaceInFile( {
				files: targetFile,
				from: /block-experiments/g,
				to: spinalcase( resource ),
			} );

			copyExtra( manifest, path.join( targetDir, 'blocks' ) );
		} catch ( error ) {
			console.error( 'Unable to create directory: ' + targetFile );
		}
	}
}

function packageBundle( { resource, version } ) {
	const resourceDir = path.join( 'bundler', 'resources', resource );
	const licenseFile = path.join( 'bundler', 'resources', 'license.txt' );
	const file = spinalcase( resource );
	const versioned = file;
	const output = `plugin/${ file }`;
	const assets = `plugin/assets`;
	const lines = [
		'#!/bin/sh',
		`./node_modules/.bin/wp-scripts build ./build/src --output-path=${ assets } --config ./bundler/webpack.config.js`,
		`cp ${ assets }/* ${ output }`,
		`./node_modules/.bin/node-sass ./build/editor.scss -o ${ output }`,
		`./node_modules/.bin/node-sass ./build/style.scss -o ${ output }`,
		`if [ -d ${ resourceDir } ]; then cp -R ${ resourceDir }/* ${ output }; fi;`,
		`cp ${ licenseFile } ${ output }`,
		`(cd plugin; zip ${ versioned }.zip -r ${ file })`,
		`mkdir -p bundles`,
		`mv plugin/${ versioned }.zip bundles/${ versioned }.zip`,
		`rm -rf ${ assets }`,
	];

	fs.mkdirp( 'build' ).then( function () {
		fs.writeFileSync( './build/bundle.sh', lines.join( '\n' ) );
		fs.chmodSync( './build/bundle.sh', 0o755 );
	} );
}

export {
	storeFile,
	buildStyle,
	buildIndexJs,
	buildIndexPhp,
	copyBlocks,
	packageBundle,
};
