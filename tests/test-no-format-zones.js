#!/usr/bin/env node

/**
 * Test backtick no-format zones
 * Verifies that text wrapped in backticks is exempt from every transformation
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
console.log('No-Format Zone (Backtick) Tests');
console.log('='.repeat(60));

// --- extractNoFormatZones ---
console.log('\n1. extractNoFormatZones');
console.log('-'.repeat(40));

{
    const { text, zones } = extractNoFormatZones('hello `world` end');
    test('backtick region becomes a placeholder', !text.includes('world'), true);
    test('original content stored in zones', zones[0], 'world');
    test('surrounding text preserved', text.startsWith('hello ') && text.endsWith(' end'), true);
}

{
    const { text, zones } = extractNoFormatZones('no backticks here');
    test('text without backticks is unchanged', text, 'no backticks here');
    test('zones array is empty when no backticks', zones.length, 0);
}

{
    const { text, zones } = extractNoFormatZones('`a` and `b`');
    test('multiple zones extracted', zones.length, 2);
    test('first zone content correct', zones[0], 'a');
    test('second zone content correct', zones[1], 'b');
}

{
    const { text, zones } = extractNoFormatZones('``');
    test('empty backtick zone extracted', zones.length, 1);
    test('empty zone content is empty string', zones[0], '');
}

// --- restoreNoFormatZones ---
console.log('\n2. restoreNoFormatZones');
console.log('-'.repeat(40));

{
    const { text, zones } = extractNoFormatZones('hello `world` end');
    const restored = restoreNoFormatZones(text, zones);
    test('restored text matches original (without backticks)', restored, 'hello world end');
}

{
    const { text, zones } = extractNoFormatZones('`a` and `b`');
    const restored = restoreNoFormatZones(text, zones);
    test('multiple zones restored correctly', restored, 'a and b');
}

{
    const restored = restoreNoFormatZones('no zones here', []);
    test('empty zones array returns text unchanged', restored, 'no zones here');
}

// --- Protection from markdown styles ---
console.log('\n3. Protected from markdown formatting');
console.log('-'.repeat(40));

{
    // *italic* inside backticks should not be italicized
    const { text, zones } = extractNoFormatZones('`*hello*`');
    const transformed = applyMarkdownStyles(text, 'bold');
    const restored = restoreNoFormatZones(transformed, zones);
    test('*text* inside backticks not italicized', restored, '*hello*');
}

{
    // **bold** inside backticks should not be bolded
    const { text, zones } = extractNoFormatZones('`**hello**`');
    const transformed = applyMarkdownStyles(text, 'bold');
    const restored = restoreNoFormatZones(transformed, zones);
    test('**text** inside backticks not bolded', restored, '**hello**');
}

{
    // ~~strikethrough~~ inside backticks unchanged
    const { text, zones } = extractNoFormatZones('`~~hello~~`');
    const transformed = applyMarkdownStyles(text, 'bold');
    const restored = restoreNoFormatZones(transformed, zones);
    test('~~text~~ inside backticks not struck through', restored, '~~hello~~');
}

// --- Protection from uppercase word style ---
console.log('\n4. Protected from uppercase word style');
console.log('-'.repeat(40));

{
    const { text, zones } = extractNoFormatZones('`HELLO`');
    const transformed = replaceUppercaseWords(text, 'bold');
    const restored = restoreNoFormatZones(transformed, zones);
    test('uppercase word inside backticks not styled', restored, 'HELLO');
}

// --- Protection from number style ---
console.log('\n5. Protected from number formatting');
console.log('-'.repeat(40));

{
    const { text, zones } = extractNoFormatZones('`123`');
    const transformed = boldNumbers(text, 'bold');
    const restored = restoreNoFormatZones(transformed, zones);
    test('digits inside backticks not bolded', restored, '123');
}

// --- Protection from punctuation replacements ---
console.log('\n6. Protected from punctuation replacements');
console.log('-'.repeat(40));

{
    const { text, zones } = extractNoFormatZones('`hello, world`');
    const transformed = replaceCommas(text, '、');
    const restored = restoreNoFormatZones(transformed, zones);
    test('comma inside backticks not replaced', restored, 'hello, world');
}

{
    const { text, zones } = extractNoFormatZones('`wow!`');
    const transformed = replaceExclamations(text, '.ᐟ');
    const restored = restoreNoFormatZones(transformed, zones);
    test('exclamation inside backticks not replaced', restored, 'wow!');
}

{
    const { text, zones } = extractNoFormatZones('`really?`');
    const transformed = replaceQuestions(text, '.ᐣ');
    const restored = restoreNoFormatZones(transformed, zones);
    test('question mark inside backticks not replaced', restored, 'really?');
}

// --- Protection from space replacement ---
console.log('\n7. Protected from space replacement');
console.log('-'.repeat(40));

{
    const { text, zones } = extractNoFormatZones('`hello world`');
    const transformed = replaceSpaces(text, 'thin-space');
    const restored = restoreNoFormatZones(transformed, zones);
    test('spaces inside backticks not replaced', restored, 'hello world');
}

// --- Mixed: outside text is transformed, inside is not ---
console.log('\n8. Mixed: outside transforms, inside protected');
console.log('-'.repeat(40));

{
    const { text, zones } = extractNoFormatZones('*italic* and `*not italic*`');
    const transformed = applyMarkdownStyles(text, 'bold');
    const restored = restoreNoFormatZones(transformed, zones);
    const italicI = [...'italic'].map(ch => ITALIC_FONTS[ch] || ch).join('');
    test('outside italic applied, inside backticks unchanged',
        restored,
        `${italicI} and *not italic*`
    );
}

{
    const { text, zones } = extractNoFormatZones('room 101 is `room 202`');
    const transformed = boldNumbers(text, 'bold');
    const restored = restoreNoFormatZones(transformed, zones);
    test('digits outside bolded, digits inside backticks unchanged',
        restored,
        'room 𝟏𝟎𝟏 is room 202'
    );
}

// ============================================================
console.log('\n' + '='.repeat(60));
console.log('Test Summary');
console.log('='.repeat(60));
console.log(`Total: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log();

if (failed === 0) {
    console.log('\u2713 All no-format zone tests passed!');
    process.exit(0);
} else {
    console.log('\u2717 Some no-format zone tests failed.');
    process.exit(1);
}
