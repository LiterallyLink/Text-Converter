/**
 * Settings Manager
 * Handles the settings modal for configuring per-profile settings
 */

/**
 * Gets the layout preference from localStorage
 * @returns {boolean} Whether to show controls on main page
 */
function getLayoutPreference() {
    const pref = localStorage.getItem('showControlsOnMain');
    return pref === 'true';
}

/**
 * Sets the layout preference in localStorage
 * @param {boolean} show - Whether to show controls on main page
 */
function setLayoutPreference(show) {
    localStorage.setItem('showControlsOnMain', show.toString());
}

/**
 * Gets the text alignment preference from localStorage
 * @returns {boolean} Whether text alignment is enabled
 */
function getTextAlignmentPreference() {
    return localStorage.getItem('textAlignment') === 'true';
}

/**
 * Sets the text alignment preference in localStorage
 * @param {boolean} enabled - Whether text alignment is enabled
 */
function setTextAlignmentPreference(enabled) {
    localStorage.setItem('textAlignment', enabled.toString());
}

/**
 * Gets the alignment width from localStorage
 * @returns {number} The alignment width (default 35)
 */
function getAlignmentWidthPreference() {
    return parseInt(localStorage.getItem('alignmentWidth')) || 35;
}

/**
 * Sets the alignment width in localStorage
 * @param {number} width - The alignment width
 */
function setAlignmentWidthPreference(width) {
    localStorage.setItem('alignmentWidth', width.toString());
}

/**
 * Updates the alignment preview with wrapped lorem ipsum text
 * @param {number} maxWidth - The max line width
 */
function updateAlignmentPreview(maxWidth) {
    const preview = document.getElementById('alignmentPreview');
    if (!preview) return;

    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.";
    const words = lorem.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
        const test = currentLine ? currentLine + ' ' + word : word;
        if (test.length > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = test;
        }
    }
    if (currentLine) lines.push(currentLine);

    preview.textContent = lines.join('\n');
}

/**
 * Applies the text alignment preference
 */
function applyTextAlignmentPreference() {
    const enabled = getTextAlignmentPreference();
    const hiddenInput = document.getElementById('textAlignment');
    const checkbox = document.getElementById('enableTextAlignment');

    if (hiddenInput) {
        hiddenInput.value = enabled.toString();
    }
    if (checkbox) {
        checkbox.checked = enabled;
    }

    // Apply alignment width
    const width = getAlignmentWidthPreference();
    const widthInput = document.getElementById('alignmentWidth');
    const slider = document.getElementById('settingsAlignmentWidth');
    const valueLabel = document.getElementById('alignmentWidthValue');
    const container = document.getElementById('alignmentWidthContainer');

    if (widthInput) widthInput.value = width;
    if (slider) slider.value = width;
    if (valueLabel) valueLabel.textContent = width;
    if (container) container.style.display = enabled ? 'block' : 'none';
    if (enabled) updateAlignmentPreview(width);
}

/**
 * Applies the layout preference (show/hide main page controls)
 */
function applyLayoutPreference() {
    const showControls = getLayoutPreference();
    const advancedControls = document.getElementById('advancedControls');
    const showControlsCheckbox = document.getElementById('showControlsOnMain');

    if (advancedControls) {
        advancedControls.style.display = showControls ? 'block' : 'none';
    }

    if (showControlsCheckbox) {
        showControlsCheckbox.checked = showControls;
    }
}

/**
 * Opens the settings modal and loads profiles
 */
function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    const profileSelect = document.getElementById('settingsProfileSelect');

    // Populate profile dropdown
    updateSettingsProfileSelect(profileSelect);

    // Load current settings into modal
    loadSettingsIntoModal();

    modal.style.display = 'block';

    // Add class to body to hide buttons
    document.body.classList.add('modal-open');
}

/**
 * Closes the settings modal
 */
function closeSettingsModal() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = 'none';

    // Remove class from body to show buttons again
    document.body.classList.remove('modal-open');
}

/**
 * Updates the settings profile select dropdown with all profiles
 * @param {HTMLSelectElement} select - The select element to update
 */
function updateSettingsProfileSelect(select) {
    const profiles = getProfiles();
    const elements = window.textConverterElements;
    const currentProfile = elements.profileSelect ? elements.profileSelect.value : '';

    // Clear existing options except default
    select.innerHTML = '<option value="">Default Profile</option>';

    // Add all saved profiles
    for (const profileName in profiles) {
        const option = document.createElement('option');
        option.value = profileName;
        option.textContent = profileName;
        select.appendChild(option);
    }

    // Select the currently active profile
    select.value = currentProfile;
}

/**
 * Loads current settings from main page into the settings modal
 */
function loadSettingsIntoModal() {
    const elements = window.textConverterElements;
    if (!elements) return;

    // Load spacing - ensure we get the current value, defaulting to 0
    if (elements.outputSpacing) {
        const currentSpacing = elements.outputSpacing.value || '0';
        document.getElementById('settingsOutputSpacing').value = currentSpacing;
    } else {
        document.getElementById('settingsOutputSpacing').value = '0';
    }

    // Load text alignment setting
    const alignmentCheckbox = document.getElementById('enableTextAlignment');
    if (alignmentCheckbox && elements.textAlignment) {
        alignmentCheckbox.checked = elements.textAlignment.value === 'true';
    }

    // Load alignment width
    const alignmentSlider = document.getElementById('settingsAlignmentWidth');
    const alignmentWidthLabel = document.getElementById('alignmentWidthValue');
    const alignmentContainer = document.getElementById('alignmentWidthContainer');
    if (alignmentSlider && elements.alignmentWidth) {
        alignmentSlider.value = elements.alignmentWidth.value;
        if (alignmentWidthLabel) alignmentWidthLabel.textContent = elements.alignmentWidth.value;
    }
    if (alignmentContainer) {
        const isEnabled = alignmentCheckbox && alignmentCheckbox.checked;
        alignmentContainer.style.display = isEnabled ? 'block' : 'none';
        if (isEnabled) updateAlignmentPreview(parseInt(alignmentSlider.value));
    }

    // Load all transformation settings
    document.getElementById('settingsFirstLetterFont').value = elements.firstLetterFont.value;
    document.getElementById('settingsCommaStyle').value = elements.commaStyle.value;
    document.getElementById('settingsPunctuationStyle').value = elements.punctuationStyle.value;
    document.getElementById('settingsSpaceStyle').value = elements.spaceStyle.value;
    document.getElementById('settingsUppercaseWordStyle').value = elements.uppercaseWordStyle.value;

    // Load symbol settings
    const activeSymbolButton = Array.from(elements.symbolButtons).find(btn => btn.classList.contains('active'));
    const symbolMode = activeSymbolButton ? activeSymbolButton.id : 'symbolButton1';

    // Update settings modal symbol buttons
    document.querySelectorAll('#settingsFormControls .symbol-button').forEach(btn => btn.classList.remove('active'));
    const settingsSymbolId = symbolMode.replace('symbolButton', 'settingsSymbolButton');
    const settingsActiveButton = document.getElementById(settingsSymbolId);
    if (settingsActiveButton) {
        settingsActiveButton.classList.add('active');
        updateSettingsSymbolControls(settingsSymbolId);
    }

    document.getElementById('settingsSymbolFrequency').value = elements.symbolFrequencySlider.value;
    document.getElementById('settingsAllowRepeatSymbols').checked = elements.allowRepeatSymbols.checked;
    document.getElementById('settingsSymbolInput').value = elements.symbolInput.value;
}

/**
 * Updates symbol controls visibility in settings modal
 * @param {string} buttonId - ID of the clicked button
 */
function updateSettingsSymbolControls(buttonId) {
    const settingsSymbolControls = document.getElementById('settingsSymbolControls');
    const settingsSymbolInput = document.getElementById('settingsSymbolInput');

    if (buttonId === 'settingsSymbolButton2' || buttonId === 'settingsSymbolButton3') {
        settingsSymbolControls.style.display = 'block';
        settingsSymbolInput.style.display = buttonId === 'settingsSymbolButton3' ? 'block' : 'none';
    } else {
        settingsSymbolControls.style.display = 'none';
    }
}

/**
 * Applies settings from modal to main page
 */
function applySettingsFromModal() {
    const elements = window.textConverterElements;
    if (!elements) return;

    // Apply layout preference
    const showControls = document.getElementById('showControlsOnMain').checked;
    setLayoutPreference(showControls);
    applyLayoutPreference();

    // Apply text alignment
    const textAlignmentEnabled = document.getElementById('enableTextAlignment').checked;
    setTextAlignmentPreference(textAlignmentEnabled);
    if (elements.textAlignment) {
        elements.textAlignment.value = textAlignmentEnabled.toString();
    }

    // Apply alignment width
    const alignmentWidth = parseInt(document.getElementById('settingsAlignmentWidth').value) || 35;
    setAlignmentWidthPreference(alignmentWidth);
    if (elements.alignmentWidth) {
        elements.alignmentWidth.value = alignmentWidth;
    }

    // Apply spacing
    const spacing = parseInt(document.getElementById('settingsOutputSpacing').value) || 0;
    if (elements.outputSpacing) {
        elements.outputSpacing.value = spacing;
    }

    // Apply all transformation settings
    elements.firstLetterFont.value = document.getElementById('settingsFirstLetterFont').value;
    elements.commaStyle.value = document.getElementById('settingsCommaStyle').value;
    elements.punctuationStyle.value = document.getElementById('settingsPunctuationStyle').value;
    elements.spaceStyle.value = document.getElementById('settingsSpaceStyle').value;
    elements.uppercaseWordStyle.value = document.getElementById('settingsUppercaseWordStyle').value;

    // Apply symbol settings
    const settingsActiveButton = Array.from(document.querySelectorAll('#settingsFormControls .symbol-button')).find(btn => btn.classList.contains('active'));
    const settingsSymbolMode = settingsActiveButton ? settingsActiveButton.id : 'settingsSymbolButton1';
    const mainSymbolId = settingsSymbolMode.replace('settingsSymbolButton', 'symbolButton');

    elements.symbolButtons.forEach(btn => btn.classList.remove('active'));
    const mainSymbolButton = document.getElementById(mainSymbolId);
    if (mainSymbolButton) {
        mainSymbolButton.classList.add('active');
        updateSymbolControls(mainSymbolId, elements);
    }

    elements.symbolFrequencySlider.value = document.getElementById('settingsSymbolFrequency').value;
    elements.allowRepeatSymbols.checked = document.getElementById('settingsAllowRepeatSymbols').checked;
    elements.symbolInput.value = document.getElementById('settingsSymbolInput').value;

    // Update the current settings in the active profile (if one is selected)
    const profileName = elements.profileSelect ? elements.profileSelect.value : '';
    if (profileName && !['create_new', 'export_current', 'import_profiles'].includes(profileName)) {
        const profiles = getProfiles();
        if (profiles[profileName]) {
            profiles[profileName] = getCurrentSettings(elements);
            saveProfiles(profiles);
        }
    }

    // Update output with new spacing and settings
    updateOutput(elements);

    showNotification('Settings applied!', 'profileNotification');
    closeSettingsModal();
}

/**
 * Shows a notification message
 * @param {string} message - Message to display
 * @param {string} notificationId - ID of the notification element
 */
function showNotification(message, notificationId) {
    const notification = document.getElementById(notificationId);
    if (notification) {
        notification.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }
}

/**
 * Initializes settings modal event listeners
 */
function initSettingsModal() {
    // Apply preferences on page load
    applyLayoutPreference();
    applyTextAlignmentPreference();

    // Settings profile selector change event
    const settingsProfileSelect = document.getElementById('settingsProfileSelect');
    if (settingsProfileSelect) {
        settingsProfileSelect.addEventListener('change', function() {
            const selectedProfile = this.value;
            const elements = window.textConverterElements;

            if (!elements) return;

            // Update the main profile selector to match
            if (elements.profileSelect) {
                elements.profileSelect.value = selectedProfile;
            }

            // Load the selected profile's settings
            if (selectedProfile) {
                // Load profile settings into main elements
                loadProfile(selectedProfile, elements);
            } else {
                // Load default settings
                resetToDefaultSettings(elements);
            }

            // Reload the modal with the new profile's settings
            loadSettingsIntoModal();
        });
    }

    // Symbol button events in settings modal
    const settingsSymbolButtons = document.querySelectorAll('#settingsFormControls .symbol-button');
    settingsSymbolButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('#settingsFormControls .symbol-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateSettingsSymbolControls(this.id);
        });
    });

    // Alignment checkbox toggle - show/hide width slider
    const alignCheckbox = document.getElementById('enableTextAlignment');
    if (alignCheckbox) {
        alignCheckbox.addEventListener('change', function() {
            const container = document.getElementById('alignmentWidthContainer');
            if (container) {
                container.style.display = this.checked ? 'block' : 'none';
                if (this.checked) {
                    const slider = document.getElementById('settingsAlignmentWidth');
                    updateAlignmentPreview(parseInt(slider.value));
                }
            }
        });
    }

    // Alignment width slider - update label and preview
    const alignSlider = document.getElementById('settingsAlignmentWidth');
    if (alignSlider) {
        alignSlider.addEventListener('input', function() {
            const label = document.getElementById('alignmentWidthValue');
            if (label) label.textContent = this.value;
            updateAlignmentPreview(parseInt(this.value));
        });
    }
}
