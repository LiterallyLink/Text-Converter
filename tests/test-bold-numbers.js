#!/usr/bin/env node

/**
 * Test bold number formatting
 * Covers: all four number styles (bold, sans-bold, double-struck, monospace)
 * and edge cases (no style, non-digit chars, mixed text)
 */

const fs = require('fs');
const vm = require('vm');
vm.runInThisContext(fs.readFileSync('js/fontMappings.js', 'utf8'), { filename: 'fontMappings.js' });
vm.runInThisContext(fs.readFileSync('js/textTransformations.js', 'utf8'), { filename: 'textTransformations.js' });

let passed = 0;
let failed = 0;

function test(description, actual, expected) {
    const isPass = actual === expected;
    if (isPass) {
        console.log(`  \u2713 ${description}`);
        passed++;
    } else {
        console.log(`  \u2717 ${description}`);
        console.log(`    Expected: ${JSON.stringify(expected)}`);
        console.log(`    Actual:   ${JSON.stringify(actual)}`);
        failed++;
    }
}

// ============================================================
console.log('Bold Number Formatting Tests');
console.log('='.repeat(60));

// --- No style ---
console.log('\n1. No style selected');
console.log('-'.repeat(40));

test('digits unchanged when no style selected',
    boldNumbers('hello 123 world', ''),
    'hello 123 world'
);

test('plain text unchanged when no style selected',
    boldNumbers('abc', ''),
    'abc'
);

// --- Bold ---
console.log('\n2. Bold style');
console.log('-'.repeat(40));

test('all digits 0-9 converted to bold',
    boldNumbers('0123456789', 'bold'),
    '𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗'
);

test('digits in mixed text are bolded',
    boldNumbers('room 101', 'bold'),
    'room 𝟏𝟎𝟏'
);

test('letters are not affected by bold style',
    boldNumbers('abc', 'bold'),
    'abc'
);

// --- Sans-Serif Bold ---
console.log('\n3. Sans-Serif Bold style');
console.log('-'.repeat(40));

test('all digits 0-9 converted to sans-serif bold',
    boldNumbers('0123456789', 'sans-bold'),
    '𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵'
);

test('digits in mixed text are sans-serif bolded',
    boldNumbers('version 2.0', 'sans-bold'),
    'version 𝟮.𝟬'
);

// --- Double-Struck ---
console.log('\n4. Double-Struck style');
console.log('-'.repeat(40));

test('all digits 0-9 converted to double-struck',
    boldNumbers('0123456789', 'double-struck'),
    '𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'
);

test('digits in mixed text are double-struck',
    boldNumbers('chapter 7', 'double-struck'),
    'chapter 𝟟'
);

// --- Monospace ---
console.log('\n5. Monospace style');
console.log('-'.repeat(40));

test('all digits 0-9 converted to monospace',
    boldNumbers('0123456789', 'monospace'),
    '𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'
);

test('digits in mixed text are monospace',
    boldNumbers('score: 42', 'monospace'),
    'score: 𝟺𝟸'
);

// --- Edge cases ---
console.log('\n6. Edge cases');
console.log('-'.repeat(40));

test('empty string returns empty string',
    boldNumbers('', 'bold'),
    ''
);

test('no digits in text returns text unchanged',
    boldNumbers('hello world', 'bold'),
    'hello world'
);

test('only digits converted, punctuation preserved',
    boldNumbers('3.14', 'bold'),
    '𝟑.𝟏𝟒'
);

test('newlines preserved',
    boldNumbers('line1\nline2', 'bold'),
    'line𝟏\nline𝟐'
);

// ============================================================
console.log('\n' + '='.repeat(60));
console.log('Test Summary');
console.log('='.repeat(60));
console.log(`Total: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log();

if (failed === 0) {
    console.log('\u2713 All bold number formatting tests passed!');
    process.exit(0);
} else {
    console.log('\u2717 Some bold number formatting tests failed.');
    process.exit(1);
}
