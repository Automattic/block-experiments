/**
 * External dependencies
 */

import { uniq } from 'lodash';
import path from 'path';
import fs from 'fs';

const FIXTURES_DIR = path.join( __dirname, '..', 'fixtures' );

export function readFixture( filename ) {
	try {
		return fs.readFileSync( path.join( FIXTURES_DIR, filename ), 'utf8' );
	} catch ( err ) {
		return null;
	}
}

export function getFixtures( groupName ) {
	return uniq(
		fs
			.readdirSync( path.join( FIXTURES_DIR, groupName ) )
			.filter( ( f ) => /(\.html|\.json)$/.test( f ) )
	).map( ( filename ) => path.join( groupName, filename ) );
}
