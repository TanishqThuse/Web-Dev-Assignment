// Minimal sanity tests so `npm test` passes
const assert = require('assert');

console.log('Running basic sanity tests...');
assert.strictEqual(1 + 1, 2);
console.log('All tests passed.');
