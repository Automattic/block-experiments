/**
 * External dependencies
 */

import { uniq } from 'lodash';
import path from 'path';
import fs from 'fs';

/**
 * WordPress dependencies
 */
import { parse } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { registerBlock } from '../index';

const FIXTURES_DIR = path.join( __dirname, '..', '..', 'tests', 'fixtures' );

function getFixtures() {
	return uniq(
		fs
			.readdirSync( FIXTURES_DIR )
			.filter( ( f ) => /(\.html|\.json)$/.test( f ) )
	);
}

function readFixture( filename ) {
	try {
		return fs.readFileSync( path.join( FIXTURES_DIR, filename ), 'utf8' );
	} catch ( err ) {
		return null;
	}
}

registerBlock();

describe( 'Layout Grid Invalidations', () => {
	const fixtures = getFixtures();

	it.each( fixtures )(
		`does not invalidate grid blocks from fixture "%s"`,
		( fixture ) => {
			const html = readFixture( fixture );
			const parsed = parse( html );

			// No warnings
			expect( console ).not.toHaveWarned();

			// Exactly 1 block
			expect( parsed.length ).toBe( 1 );

			// No validation issues
			expect( parsed[ 0 ].validationIssues.length ).toBe( 0 );

			// It's a layout grid
			expect( parsed[ 0 ].name ).toBe( 'jetpack/layout-grid' );
		}
	);
} );
