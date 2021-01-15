/**
 * WordPress dependencies
 */
import { parse } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { registerBlock } from '../index';
import { getFixtures, readFixture } from '../../tests/tools/fixtures';
import { isValid } from '../../tests/tools/block';

registerBlock();

describe( 'Layout Grid Invalidations', () => {
	const fixtures = getFixtures( 'invalidation' );

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
			expect( isValid( parsed[ 0 ] ) ).toBe( true );

			// It's a layout grid
			expect( parsed[ 0 ].name ).toBe( 'jetpack/layout-grid' );
		}
	);
} );
