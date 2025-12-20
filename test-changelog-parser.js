#!/usr/bin/env node

/**
 * Test changelog parser logic
 */

const fs = require('fs');

console.log('Testing Changelog Parser Logic');
console.log('='.repeat(60));
console.log();

// Read changelog
const changelogText = fs.readFileSync('changelog.txt', 'utf8');
const lines = changelogText.split('\n');

// Simulate the parsing logic from uiHandlers.js
let currentVersion = null;
let currentChanges = [];
const versions = [];

lines.forEach(line => {
    if (line.startsWith('Version ')) {
        // Save previous version if it exists
        if (currentVersion) {
            versions.push({
                version: currentVersion,
                changes: [...currentChanges]
            });
        }
        // Start new version
        currentVersion = line;
        currentChanges = [];
    } else if (line.trim() !== '') {
        // Add change to current version
        currentChanges.push(line);
    }
});

// Add the last version
if (currentVersion) {
    versions.push({
        version: currentVersion,
        changes: [...currentChanges]
    });
}

console.log(`Found ${versions.length} versions\n`);

// Test each version
let allTestsPassed = true;

versions.forEach((versionData, index) => {
    console.log(`Version ${index + 1}: ${versionData.version}`);
    console.log('-'.repeat(60));

    // Check if this version has categories
    const hasNew = versionData.changes.some(c => c.trim() === 'New:');
    const hasFixes = versionData.changes.some(c => c.trim() === 'Fixes:');
    const hasChanges = versionData.changes.some(c => c.trim() === 'Changes:');

    console.log(`  Categories found:`);
    console.log(`    - New: ${hasNew ? '✓' : '✗'}`);
    console.log(`    - Fixes: ${hasFixes ? '✓' : '✗'}`);
    console.log(`    - Changes: ${hasChanges ? '✓' : '✗'}`);

    // Parse into categorized format
    let currentCategory = null;
    const categorized = {
        'New:': [],
        'Fixes:': [],
        'Changes:': []
    };

    versionData.changes.forEach(change => {
        const trimmed = change.trim();
        if (trimmed === 'New:' || trimmed === 'Fixes:' || trimmed === 'Changes:') {
            currentCategory = trimmed;
        } else if (trimmed !== '' && currentCategory) {
            categorized[currentCategory].push(trimmed);
        }
    });

    // Display items per category
    Object.keys(categorized).forEach(category => {
        if (categorized[category].length > 0) {
            console.log(`\n  ${category}`);
            categorized[category].forEach(item => {
                console.log(`    • ${item}`);
            });
        }
    });

    // Validation
    const hasAtLeastOneCategory = hasNew || hasFixes || hasChanges;
    if (!hasAtLeastOneCategory && index === 0) {
        console.log(`\n  ⚠️  WARNING: No categories found in latest version!`);
        allTestsPassed = false;
    }

    const totalItems = Object.values(categorized).reduce((sum, arr) => sum + arr.length, 0);
    console.log(`\n  Total items: ${totalItems}`);

    if (totalItems === 0 && index === 0) {
        console.log(`  ⚠️  WARNING: No items found in latest version!`);
        allTestsPassed = false;
    }

    console.log('\n');
});

console.log('='.repeat(60));
console.log('Changelog Parser Test Results');
console.log('='.repeat(60));

if (allTestsPassed) {
    console.log('✓ All changelog parsing tests passed!');
    console.log('✓ Changelog is properly structured and categorized');
    process.exit(0);
} else {
    console.log('✗ Some changelog validation issues found');
    process.exit(1);
}
