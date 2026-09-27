const assert = require('assert');

// Node built-in assert test suite for backend API payload validation
function validateJobPayload(job) {
    if (!job || typeof job !== 'object') return false;
    if (!job.title || typeof job.title !== 'string' || job.title.trim().length === 0) return false;
    if (!job.company || typeof job.company !== 'string' || job.company.trim().length === 0) return false;
    if (!job.location || typeof job.location !== 'string' || job.location.trim().length === 0) return false;
    return true;
}

console.log('[Backend Test] Starting unit tests for backend Job payload validation...');

// Test 1: Valid job payload
const validJob = { title: 'Cloud Engineer', company: 'Microsoft', location: 'Hyderabad' };
assert.strictEqual(validateJobPayload(validJob), true, 'Valid job payload should return true');

// Test 2: Missing title
const invalidTitle = { title: '', company: 'Microsoft', location: 'Hyderabad' };
assert.strictEqual(validateJobPayload(invalidTitle), false, 'Empty job title should return false');

// Test 3: Missing company
const invalidCompany = { title: 'Cloud Engineer', company: '', location: 'Hyderabad' };
assert.strictEqual(validateJobPayload(invalidCompany), false, 'Empty company should return false');

// Test 4: Invalid input type
assert.strictEqual(validateJobPayload(null), false, 'Null job payload should return false');
assert.strictEqual(validateJobPayload('string'), false, 'String job payload should return false');

console.log('[Backend Test] All backend unit tests passed successfully!');
