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
        profileSelect: document.getElementById('profileSelect'),
        saveProfileButton: document.getElementById('saveProfileButton'),
        deleteProfileButton: document.getElementById('deleteProfileButton'),
        outputSpacing: document.getElementById('outputSpacing'),
        textAlignment: document.getElementById('textAlignment'),
    };

    // Store elements globally for import/export access
    window.textConverterElements = elements;

    const changelogModal = document.getElementById('changelogModal');
    const changelogButton = document.getElementById('changelogButton');
    const privacyPolicyModal = document.getElementById('privacyPolicyModal');
    const privacyPolicyButton = document.getElementById('privacyPolicyButton');
    const settingsModal = document.getElementById('settingsModal');
    const settingsButton = document.getElementById('settingsButton');
    const settingsProfileSelect = document.getElementById('settingsProfileSelect');
    const saveSettingsButton = document.getElementById('saveSettingsButton');
    const closeButtons = document.querySelectorAll('.close-button');
    const changelogContent = document.getElementById('changelogContent');

    // Initialize theme
    loadTheme(elements);
    
    // Initialize profile manager
    initProfileManager(elements);

    // Initialize import/export functionality
    initImportExport(elements);

    // Initialize settings modal
    initSettingsModal();

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
    changelogButton.addEventListener('click', (e) => {
        e.preventDefault();
        changelogModal.style.display = 'block';
        loadChangelog(changelogContent);
    });
    
    // Privacy Policy Modal Events
    privacyPolicyButton.addEventListener('click', (e) => {
        e.preventDefault();
        privacyPolicyModal.style.display = 'block';
    });

    // Settings Modal Events
    settingsButton.addEventListener('click', () => {
        openSettingsModal();
    });

    saveSettingsButton.addEventListener('click', () => {
        applySettingsFromModal();
    });

    // Close buttons for all modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal === settingsModal) {
                closeSettingsModal();
            } else {
                modal.style.display = 'none';
            }
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === changelogModal) {
            changelogModal.style.display = 'none';
        }
        if (e.target === privacyPolicyModal) {
            privacyPolicyModal.style.display = 'none';
        }
        if (e.target === settingsModal) {
            closeSettingsModal();
        }
    });
});