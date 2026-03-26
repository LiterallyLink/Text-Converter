#!/usr/bin/env node

/**
 * Test Discord-style markdown formatting
 * Covers: *italic*, _italic_, **bold**, ***bold italic***,
 *         __underline__, ~~strikethrough~~, and all nesting combinations
 */

// Load font mappings and transformation functions using vm.runInThisContext
// so that const/let declarations become available in this module scope
const fs = require('fs');
const vm = require('vm');
vm.runInThisContext(fs.readFileSync('js/fontMappings.js', 'utf8'), { filename: 'fontMappings.js' });
vm.runInThisContext(fs.readFileSync('js/textTransformations.js', 'utf8'), { filename: 'textTransformations.js' });

const COMBINING_LOW_LINE = '\u0332';   // underline
const COMBINING_STROKE = '\u0336';     // strikethrough

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

// Helper: apply italic font mapping to a string
function italicize(str) {
    return [...str].map(ch => ITALIC_FONTS[ch] || ch).join('');
}

// Helper: apply bold-italic font mapping
function boldItalicize(str) {
    return [...str].map(ch => BOLD_ITALIC_FONTS[ch] || ch).join('');
}

// Helper: apply underline combining char to every code point
function underline(str) {
    return [...str].map(ch => ch + COMBINING_LOW_LINE).join('');
}

// Helper: apply strikethrough combining char
function strikethrough(str) {
    return [...str].map(ch => ch + COMBINING_STROKE).join('');
}

// We'll use 'bold' as the uppercase style for bold tests
const uppercaseStyle = 'bold';

function boldify(str) {
    return UPPERCASE_WORD_STYLES['bold'].transform(str);
}

// ============================================================
console.log('Discord-Style Markdown Formatting Tests');
console.log('='.repeat(60));

// --- Italic ---
console.log('\n1. Italic (*text* and _text_)');
console.log('-'.repeat(40));

test('*hello* produces italic',
    applyMarkdownStyles('*hello*', uppercaseStyle),
    italicize('hello')
);

test('_hello_ produces italic',
    applyMarkdownStyles('_hello_', uppercaseStyle),
    italicize('hello')
);

test('*multi word italic*',
    applyMarkdownStyles('*hello world*', uppercaseStyle),
    italicize('hello world')
);

test('plain text unchanged',
    applyMarkdownStyles('hello world', uppercaseStyle),
    'hello world'
);

// --- Bold ---
console.log('\n2. Bold (**text**)');
console.log('-'.repeat(40));

test('**hello** produces bold',
    applyMarkdownStyles('**hello**', uppercaseStyle),
    boldify('hello')
);

test('**multi word bold**',
    applyMarkdownStyles('**hello world**', uppercaseStyle),
    boldify('hello world')
);

// --- Bold Italic ---
console.log('\n3. Bold Italic (***text***)');
console.log('-'.repeat(40));

test('***hello*** produces bold italic',
    applyMarkdownStyles('***hello***', uppercaseStyle),
    boldItalicize('hello')
);

test('***multi word*** bold italic',
    applyMarkdownStyles('***hello world***', uppercaseStyle),
    boldItalicize('hello world')
);

// --- Underline ---
console.log('\n4. Underline (__text__)');
console.log('-'.repeat(40));

test('__hello__ produces underline',
    applyMarkdownStyles('__hello__', uppercaseStyle),
    underline('hello')
);

test('__multi word__ underline',
    applyMarkdownStyles('__hello world__', uppercaseStyle),
    underline('hello world')
);

// --- Strikethrough ---
console.log('\n5. Strikethrough (~~text~~)');
console.log('-'.repeat(40));

test('~~hello~~ produces strikethrough',
    applyMarkdownStyles('~~hello~~', uppercaseStyle),
    strikethrough('hello')
);

test('~~multi word~~ strikethrough',
    applyMarkdownStyles('~~hello world~~', uppercaseStyle),
    strikethrough('hello world')
);

// --- Underline + Italic ---
console.log('\n6. Underline + Italic (__*text*__)');
console.log('-'.repeat(40));

test('__*hello*__ produces underline italic',
    applyMarkdownStyles('__*hello*__', uppercaseStyle),
    underline(italicize('hello'))
);

test('__*multi word*__ underline italic',
    applyMarkdownStyles('__*multi word*__', uppercaseStyle),
    underline(italicize('multi word'))
);

// --- Underline + Bold ---
console.log('\n7. Underline + Bold (__**text**__)');
console.log('-'.repeat(40));

test('__**hello**__ produces underline bold',
    applyMarkdownStyles('__**hello**__', uppercaseStyle),
    underline(boldify('hello'))
);

// --- Underline + Bold Italic ---
console.log('\n8. Underline + Bold Italic (__***text***__)');
console.log('-'.repeat(40));

test('__***hello***__ produces underline bold italic',
    applyMarkdownStyles('__***hello***__', uppercaseStyle),
    underline(boldItalicize('hello'))
);

// --- Multiple formats in one line ---
console.log('\n9. Mixed formatting in one line');
console.log('-'.repeat(40));

test('*italic* and **bold** in same line',
    applyMarkdownStyles('*italic* and **bold**', uppercaseStyle),
    italicize('italic') + ' and ' + boldify('bold')
);

test('__underline__ and ~~strike~~ in same line',
    applyMarkdownStyles('__underline__ and ~~strike~~', uppercaseStyle),
    underline('underline') + ' and ' + strikethrough('strike')
);

// --- Edge cases ---
console.log('\n10. Edge cases');
console.log('-'.repeat(40));

test('Empty bold markers **** collapse (consistent with Discord)',
    applyMarkdownStyles('****', uppercaseStyle),
    '**'
);

test('No markers: plain text unchanged',
    applyMarkdownStyles('just plain text', uppercaseStyle),
    'just plain text'
);

test('Single asterisk not matched: a * b',
    applyMarkdownStyles('a * b', uppercaseStyle),
    'a * b'
);

// --- Bold with no uppercase style selected ---
console.log('\n11. Bold with no style selected');
console.log('-'.repeat(40));

test('**text** with empty style returns plain text',
    applyMarkdownStyles('**hello**', ''),
    'hello'
);

test('***text*** still applies bold-italic font even without uppercase style',
    applyMarkdownStyles('***hello***', ''),
    boldItalicize('hello')
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
    console.log('\u2713 All markdown formatting tests passed!');
    process.exit(0);
} else {
    console.log('\u2717 Some markdown formatting tests failed.');
    process.exit(1);
}
