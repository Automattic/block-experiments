import v1 from './v1';
import v2 from './v2';

// Deprecations should run in reverse chronological order. Most probable
// deprecations to run are the most recent. This ordering makes the process
// a little more performant.
export default [ v2, v1 ];
