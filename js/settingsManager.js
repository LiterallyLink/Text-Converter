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
}

/**
 * Closes the settings modal
 */
function closeSettingsModal() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = 'none';
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
    // Apply layout preference on page load
    applyLayoutPreference();

    // Symbol button events in settings modal
    const settingsSymbolButtons = document.querySelectorAll('#settingsFormControls .symbol-button');
    settingsSymbolButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('#settingsFormControls .symbol-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateSettingsSymbolControls(this.id);
        });
    });
}
