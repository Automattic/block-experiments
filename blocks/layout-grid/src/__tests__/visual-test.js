/**
 * External dependencies
 */

import { generateImage } from 'jsdom-screenshot';
import { render } from '@testing-library/react';
import path from 'path';

/**
 * Internal dependencies
 */
import { registerBlock } from '../index';
import { Block, Theme, dumpHTML } from '../../tests/tools/block';
import { getFixtures, readFixture } from '../../tests/tools/fixtures';

// Enable this to help with debugging
const LOG_HTML = false;

const VIEWPORTS = [
	{
		name: 'desktop',
		width: 1600,
		height: 1200,
	},
	{
		name: 'tablet',
		width: 600,
		height: 1200,
	},
	{
		name: 'mobile',
		width: 480,
		height: 1200,
	},
];

function getSnapshotFilename( fixture ) {
	return fixture.replace( 'visual/', '' ).replace( '.html', '' );
}

describe( 'Grid Block visual regression', () => {
	beforeAll( () => {
		registerBlock();
	} );

	const fixtures = getFixtures( 'visual' );

	it.each( fixtures )(
		'does not regress grid blocks from previous snapshot "%s"',
		async ( fixture ) => {
			const html = readFixture( fixture );

			render(
				<Theme theme="twentytwenty">
					<Block blockHTML={ html } />
				</Theme>
			);

			for ( let index = 0; index < VIEWPORTS.length; index++ ) {
				const { width, height, name } = VIEWPORTS[ index ];

				const screenshot = await generateImage( {
					viewport: { width, height },
					options: {
						fullPage: true,
					},
					targetSelector: '.entry-content',
				} );

				if ( LOG_HTML ) {
					dumpHTML(
						path.join(
							__dirname,
							getSnapshotFilename( fixture + '-' + name ) +
								'.html'
						)
					);
				}

				expect( screenshot ).toMatchImageSnapshot( {
					customSnapshotIdentifier: getSnapshotFilename(
						fixture + '-' + name
					),
				} );
			}
		}
	);
} );
