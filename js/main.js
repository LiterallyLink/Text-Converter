/**
 * Main Application Script
 * Initializes the application and sets up event listeners
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        inputText: document.getElementById('inputText'),
        firstLetterFont: document.getElementById('firstLetterFont'),
        commaStyle: document.getElementById('commaStyle'),
        punctuationStyle: document.getElementById('punctuationStyle'),
        spaceStyle: document.getElementById('spaceStyle'),
        symbolStyle: document.getElementById('symbolStyle'),
        uppercaseWordStyle: document.getElementById('uppercaseWordStyle'),
        output: document.getElementById('output'),
        copyButton: document.getElementById('copyButton'),
        themeToggle: document.getElementById('checkbox'),
        symbolButtons: document.querySelectorAll('.symbol-button'),
        symbolControls: document.getElementById('symbolControls'),
        symbolFrequencySlider: document.getElementById('symbolFrequency'),
        symbolInput: document.getElementById('symbolInput'),
        copyNotification: document.getElementById('copyNotification'),
        allowRepeatSymbols: document.getElementById('allowRepeatSymbols'),
    };

    const changelogModal = document.getElementById('changelogModal');
    const changelogButton = document.getElementById('changelogButton');
    const closeButton = document.querySelector('.close-button');
    const changelogContent = document.getElementById('changelogContent');

    // Initialize theme
    loadTheme(elements);

    // Event Listeners for Text Transformations
    elements.inputText.addEventListener('input', () => updateOutput(elements));
    elements.firstLetterFont.addEventListener('change', () => updateOutput(elements));
    elements.uppercaseWordStyle.addEventListener('change', () => updateOutput(elements));
    elements.commaStyle.addEventListener('change', () => updateOutput(elements));
    elements.punctuationStyle.addEventListener('change', () => updateOutput(elements));
    elements.spaceStyle.addEventListener('change', () => updateOutput(elements));
    elements.symbolFrequencySlider.addEventListener('input', () => updateOutput(elements));
    elements.symbolInput.addEventListener('input', () => updateOutput(elements));
    elements.allowRepeatSymbols.addEventListener('change', () => updateOutput(elements));

    // Copy Button Event
    elements.copyButton.addEventListener('click', () => copyToClipboard(elements));

    // Symbol Button Events
    elements.symbolButtons.forEach(button => {
        button.addEventListener('click', function() {
            updateSymbolControls(this.id, elements);
            updateOutput(elements);
        });
    });

    // Theme Toggle Event
    elements.themeToggle.addEventListener('change', handleThemeChange);
    
    // Changelog Modal Events
    changelogButton.addEventListener('click', (e) => 
        openChangelogModal(e, changelogModal, changelogContent));
    
    closeButton.addEventListener('click', () => 
        closeChangelogModal(changelogModal));
    
    window.addEventListener('click', (e) => 
        handleWindowClick(e, changelogModal));
});