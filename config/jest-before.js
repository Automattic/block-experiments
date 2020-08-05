/**
 * External dependencies
 */

import { toMatchImageSnapshot } from 'jest-image-snapshot';

/**
 * WordPress dependencies
 */

expect.extend( { toMatchImageSnapshot } );
jest.setTimeout( 100000 );
