#!/usr/bin/env node

/**
 * Test spacing functionality
 */

console.log('Testing Output Spacing Functionality');
console.log('='.repeat(60));
console.log();

// Load the functions (simulate browser environment)
const invisibleSpace = 'ᅠ';

function applySpacing(text, spacing) {
    if (spacing === 0) {
        return text;
    }

    // Add top spacing
    let spacedText = text;
    for (let i = 0; i < spacing; i++) {
        spacedText = invisibleSpace + '\n' + spacedText;
    }

    // Add bottom spacing
    for (let i = 0; i < spacing; i++) {
        spacedText = spacedText + '\n' + invisibleSpace;
    }

    return spacedText;
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
        console.log(`  Actual: ${JSON.stringify(actual)}`);
        failed++;
    }
}

function testContains(description, actual, shouldContain, count) {
    const actualCount = (actual.match(new RegExp(shouldContain, 'g')) || []).length;
    const isPass = actualCount === count;
    if (isPass) {
        console.log(`✓ ${description}`);
        passed++;
    } else {
        console.log(`✗ ${description}`);
        console.log(`  Expected ${count} occurrences of "${shouldContain}"`);
        console.log(`  Found ${actualCount} occurrences`);
        failed++;
    }
}

// Test 1: No spacing
let result = applySpacing('test', 0);
test('Spacing 0: returns original text', result, 'test');

// Test 2: Spacing 1
result = applySpacing('test', 1);
testContains('Spacing 1: has 2 newlines', result, '\n', 2);
testContains('Spacing 1: has 2 invisible spaces', result, invisibleSpace, 2);
test('Spacing 1: text is in the middle', result.includes('test'), true);

// Test 3: Spacing 2
result = applySpacing('test', 2);
testContains('Spacing 2: has 4 newlines', result, '\n', 4);
testContains('Spacing 2: has 4 invisible spaces', result, invisibleSpace, 4);

// Test 4: Spacing 3
result = applySpacing('test', 3);
testContains('Spacing 3: has 6 newlines', result, '\n', 6);
testContains('Spacing 3: has 6 invisible spaces', result, invisibleSpace, 6);

// Test 5: Spacing 5 (max)
result = applySpacing('test', 5);
testContains('Spacing 5: has 10 newlines', result, '\n', 10);
testContains('Spacing 5: has 10 invisible spaces', result, invisibleSpace, 10);

// Test 6: Verify structure
result = applySpacing('hello', 2);
const lines = result.split('\n');
test('Spacing creates 5 total lines (2 top + content + 2 bottom)', lines.length, 5);

// Test 7: Verify invisible character is Unicode Hangul Filler
const charCode = invisibleSpace.charCodeAt(0);
test('Invisible space is Hangul Filler (U+1160)', charCode, 0x1160);

// Test 8: Empty text handling
result = applySpacing('', 2);
testContains('Empty text with spacing: has newlines', result, '\n', 4);

// Test 9: Multi-line text
result = applySpacing('line1\nline2', 1);
testContains('Multi-line text: preserves internal newlines', result, '\n', 3); // 1 internal + 2 spacing = 3 total
test('Multi-line text: contains both lines', result.includes('line1') && result.includes('line2'), true);

console.log();
console.log('='.repeat(60));
console.log('Test Summary');
console.log('='.repeat(60));
console.log(`Total: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log();

if (failed === 0) {
    console.log('✓ All spacing tests passed!');
    console.log();
    console.log('Example output with spacing 2:');
    console.log('─'.repeat(60));
    const example = applySpacing('Hello, World!', 2);
    // Show with visual markers
    const visual = example
        .split('\n')
        .map((line, i) => `Line ${i + 1}: "${line}"`)
        .join('\n');
    console.log(visual);
    console.log('─'.repeat(60));
    process.exit(0);
} else {
    console.log('✗ Some spacing tests failed');
    process.exit(1);
}
