/**
 * WordPress dependencies
 */
import { parse, serialize, rawHandler } from '@wordpress/blocks';
import { registerCoreBlocks } from '@wordpress/block-library';

/**
 * Internal dependencies
 */
import { registerBlock } from '../index';
import { isValid } from '../../tests/tools/block';
import { readFixture } from '../../tests/tools/fixtures';

registerBlock();

describe( 'Layout Grid Migrations', () => {
	beforeAll( () => {
		registerCoreBlocks();
	} );

	it( 'migrates missing is-background for custom colors', () => {
		const html = readFixture( 'migration/1.3-custom-color.html' );
		const parsed = parse( html );

		// No warnings
		expect( console ).toHaveInformed();

		// Exactly 1 block
		expect( parsed.length ).toBe( 1 );

		const gridBlock = parsed[ 0 ];

		// It's a layout grid
		expect( gridBlock.name ).toBe( 'jetpack/layout-grid' );
		expect( gridBlock.innerBlocks.length ).toBe( 3 );

		// No validation issues
		expect( isValid( gridBlock ) ).toBe( true );

		// Check attributes are correct
		const columnBlock = gridBlock.innerBlocks[ 1 ];
		const htmlBlock = serialize( columnBlock );

		// Custom background still exists
		expect( columnBlock.attributes.customBackgroundColor ).toBe(
			'#7c451f'
		);

		// has-background has been added to the block
		expect( htmlBlock.indexOf( 'has-background' ) !== -1 ).toBe( true );

		// The custom color is in the block
		expect( htmlBlock.indexOf( '7c451f' ) !== -1 ).toBe( true );

		// We still have our grid content
		expect( htmlBlock.indexOf( 'long established' ) !== -1 ).toBe( true );
	} );
} );
