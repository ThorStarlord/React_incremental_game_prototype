// Release validation is intentionally a thin named entry point so CI, local
// runbooks, and release notes all invoke the same authoritative composition.
require('./release-one-point-zero');
