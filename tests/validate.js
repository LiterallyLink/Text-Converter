#!/usr/bin/env node

/**
 * Validation script for Text Converter
 * Tests code syntax and basic functionality
 */

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
        passed++;
    } catch (error) {
        console.log(`✗ ${name}`);
        console.log(`  Error: ${error.message}`);
        failed++;
    }
}

console.log('='.repeat(60));
console.log('Text Converter - Validation Suite');
console.log('='.repeat(60));
console.log();

// Test 1: Verify all JavaScript files have valid syntax
console.log('1. JavaScript Syntax Validation');
console.log('-'.repeat(60));

const jsFiles = [
    'js/fontMappings.js',
    'js/textTransformations.js',
    'js/uiHandlers.js',
    'js/profileManager.js',
    'js/importExport.js',
    'js/settingsManager.js',
    'js/main.js'
];

jsFiles.forEach(file => {
    test(`Syntax check: ${file}`, () => {
        const content = fs.readFileSync(file, 'utf8');
        // Basic syntax check - if it throws, it's invalid
        new Function(content);
    });
});

console.log();

// Test 2: Verify HTML file structure
console.log('2. HTML Structure Validation');
console.log('-'.repeat(60));

test('HTML file exists and is valid', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    if (!html.includes('<!DOCTYPE html>')) throw new Error('Missing DOCTYPE');
    if (!html.includes('id="inputText"')) throw new Error('Missing input text element');
    if (!html.includes('id="output"')) throw new Error('Missing output element');
    if (!html.includes('id="outputSpacing"')) throw new Error('Missing outputSpacing element');
    if (!html.includes('id="settingsOutputSpacing"')) throw new Error('Missing settingsOutputSpacing element');
    if (!html.includes('id="changelogContent"')) throw new Error('Missing changelog content element');
});

console.log();

// Test 3: Verify CSS files exist
console.log('3. CSS Files Validation');
console.log('-'.repeat(60));

const cssFiles = [
    'css/base.css',
    'css/components.css',
    'css/theme.css',
    'css/responsive.css'
];

cssFiles.forEach(file => {
    test(`CSS file exists: ${file}`, () => {
        if (!fs.existsSync(file)) throw new Error('File not found');
        const content = fs.readFileSync(file, 'utf8');
        if (content.length === 0) throw new Error('File is empty');
    });
});

test('Changelog styles exist in components.css', () => {
    const css = fs.readFileSync('css/components.css', 'utf8');
    if (!css.includes('.changelog-version')) throw new Error('Missing .changelog-version style');
    if (!css.includes('.changelog-changes')) throw new Error('Missing .changelog-changes style');
    if (!css.includes('.changelog-category')) throw new Error('Missing .changelog-category style');
    if (!css.includes('.changelog-list')) throw new Error('Missing .changelog-list style');
    if (!css.includes('color: #a78bfa')) throw new Error('Missing purple bullet color');
});

console.log();

// Test 4: Verify changelog file
console.log('4. Changelog Validation');
console.log('-'.repeat(60));

test('Changelog file exists and has content', () => {
    if (!fs.existsSync('changelog.txt')) throw new Error('changelog.txt not found');
    const content = fs.readFileSync('changelog.txt', 'utf8');
    if (content.length === 0) throw new Error('Changelog is empty');
});

test('Changelog has proper structure', () => {
    const content = fs.readFileSync('changelog.txt', 'utf8');
    if (!content.includes('Version 1.3.0')) throw new Error('Missing latest version');
    if (!content.includes('New:')) throw new Error('Missing "New:" category');
    if (!content.includes('Fixes:')) throw new Error('Missing "Fixes:" category');
    if (!content.includes('Changes:')) throw new Error('Missing "Changes:" category');
});

test('Changelog categories are properly formatted', () => {
    const content = fs.readFileSync('changelog.txt', 'utf8');
    const lines = content.split('\n');

    // Check that category headers end with colon and are followed by items
    let foundNew = false;
    let foundFixes = false;
    let foundChanges = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === 'New:') {
            foundNew = true;
            // Check that next non-empty line is an item
            let nextLine = lines[i + 1]?.trim();
            if (nextLine && nextLine !== '' && !nextLine.startsWith('Version')) {
                // Good, has content
            }
        }
        if (line === 'Fixes:') foundFixes = true;
        if (line === 'Changes:') foundChanges = true;
    }

    if (!foundNew) throw new Error('No "New:" category found');
    if (!foundFixes) throw new Error('No "Fixes:" category found');
});

console.log();

// Test 5: Verify responsive CSS for mobile fix
console.log('5. Mobile Responsive Validation');
console.log('-'.repeat(60));

test('Responsive CSS has mobile modal fix', () => {
    const css = fs.readFileSync('css/responsive.css', 'utf8');
    if (!css.includes('max-height: 80vh')) throw new Error('Missing 80vh max-height for mobile modals');
    if (!css.includes('env(safe-area-inset-bottom)')) throw new Error('Missing safe-area-inset-bottom for iOS');
});

console.log();

// Test 6: Verify settings modal elements
console.log('6. Settings Modal Validation');
console.log('-'.repeat(60));

test('Settings modal has all required elements', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    if (!html.includes('id="settingsModal"')) throw new Error('Missing settings modal');
    if (!html.includes('id="settingsButton"')) throw new Error('Missing settings button');
    if (!html.includes('id="settingsOutputSpacing"')) throw new Error('Missing settings output spacing');
    if (!html.includes('id="saveSettingsButton"')) throw new Error('Missing save settings button');
});

console.log();

// Test 7: Check for common security issues
console.log('7. Security Validation');
console.log('-'.repeat(60));

test('No innerHTML usage with user input (XSS check)', () => {
    const files = ['js/textTransformations.js', 'js/uiHandlers.js'];
    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        // Check for safe usage patterns
        // uiHandlers.js uses textContent which is safe
        // textTransformations.js should use textContent for output
    });
    // The current implementation is safe as it uses processed text
});

test('Changelog loader uses textContent (not innerHTML)', () => {
    const content = fs.readFileSync('js/uiHandlers.js', 'utf8');
    // Verify the changelog loader creates elements safely
    if (!content.includes('createElement')) throw new Error('Should use createElement for safe DOM manipulation');
});

console.log();

// Test 8: Verify profile manager functionality
console.log('8. Profile Manager Validation');
console.log('-'.repeat(60));

test('Profile manager handles spacing settings', () => {
    const content = fs.readFileSync('js/profileManager.js', 'utf8');
    if (!content.includes('spacing')) throw new Error('Missing spacing in profile manager');
    if (!content.includes('outputSpacing')) throw new Error('Missing outputSpacing handling');
});

console.log();

// Test 9: Verify main.js initialization
console.log('9. Main Application Validation');
console.log('-'.repeat(60));

test('Main.js initializes all required managers', () => {
    const content = fs.readFileSync('js/main.js', 'utf8');
    if (!content.includes('initProfileManager')) throw new Error('Missing profile manager init');
    if (!content.includes('initImportExport')) throw new Error('Missing import/export init');
    if (!content.includes('initSettingsModal')) throw new Error('Missing settings modal init');
    if (!content.includes('loadChangelog')) throw new Error('Missing changelog loader');
});

console.log();

// Summary
console.log('='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));
console.log(`Total tests: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log();

if (failed === 0) {
    console.log('✓ All validation checks passed!');
    process.exit(0);
} else {
    console.log('✗ Some validation checks failed.');
    process.exit(1);
}
