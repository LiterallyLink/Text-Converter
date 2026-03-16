#!/usr/bin/env node

/**
 * Test underline formatting functionality
 * __word__ should wrap each character with Unicode combining low line (U+0332)
 */

console.log('Testing Underline Formatting Functionality');
console.log('='.repeat(60));
console.log();

const COMBINING_LOW_LINE = '\u0332';

// Inline implementation of the underline portion of applyMarkdownStyles
function applyUnderline(text) {
    return text.replace(/__(.+?)__/g, (match, word) => {
        return word.split('').map(char => char + COMBINING_LOW_LINE).join('');
    });
}

let passed = 0;
let failed = 0;

function test(description, actual, expected) {
    const isPass = actual === expected;
    if (isPass) {
        console.log(`✓ ${description}`);
        passed++;
    } else {
        console.log(`✗ ${description}`);
        console.log(`  Expected: ${JSON.stringify(expected)}`);
        console.log(`  Actual:   ${JSON.stringify(actual)}`);
        failed++;
    }
}

// Test 1: Basic underline
test(
    'Basic underline: __hello__ underlines each character',
    applyUnderline('__hello__'),
    'h\u0332e\u0332l\u0332l\u0332o\u0332'
);

// Test 2: Single word
test(
    'Single word: __a__ underlines one character',
    applyUnderline('__a__'),
    'a\u0332'
);

// Test 3: Multiple words in one go
test(
    'Multiple underlined words in one string',
    applyUnderline('__hi__ and __bye__'),
    'h\u0332i\u0332 and b\u0332y\u0332e\u0332'
);

// Test 4: No underline markers — text unchanged
test(
    'No markers: text is unchanged',
    applyUnderline('hello world'),
    'hello world'
);

// Test 5: Underline with spaces inside
test(
    'Underline with spaces: __hello world__',
    applyUnderline('__hello world__'),
    'h\u0332e\u0332l\u0332l\u0332o\u0332 \u0332w\u0332o\u0332r\u0332l\u0332d\u0332'
);

// Test 6: Underline does NOT consume bold markers
test(
    'Bold markers left untouched by underline pass',
    applyUnderline('**bold**'),
    '**bold**'
);

// Test 7: Underline does NOT consume italic markers
test(
    'Italic markers left untouched by underline pass',
    applyUnderline('*italic*'),
    '*italic*'
);

// Test 8: Underline before bold — combined syntax
// After underline pass, bold markers should still be present
const combined = applyUnderline('__u__ **b**');
test(
    'Underline processed first; bold markers still present for next pass',
    combined,
    'u\u0332 **b**'
);

// Test 9: Empty underline markers — no change (non-greedy match requires at least one char)
test(
    'Empty underline ____ is not processed',
    applyUnderline('____'),
    '____'
);

// Test 10: Numbers and special characters get underlined
test(
    'Numbers get combining low line: __123__',
    applyUnderline('__123__'),
    '1\u03322\u03323\u0332'
);

console.log();
console.log('='.repeat(60));
console.log('Test Summary');
console.log('='.repeat(60));
console.log(`Total: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log();

if (failed === 0) {
    console.log('✓ All underline tests passed!');
    process.exit(0);
} else {
    console.log('✗ Some underline tests failed.');
    process.exit(1);
}
