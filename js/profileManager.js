/**
 * Profile Manager
 * Handles saving, loading, and managing user profiles using cookies
 */

// Maximum number of allowed profiles
const MAX_PROFILES = 5;

// Cookie expiration (in days)
const COOKIE_EXPIRATION_DAYS = 365;

/**
 * Gets all saved profiles from cookies
 * @returns {Object} Object containing all saved profiles
 */
function getProfiles() {
    const profilesCookie = getCookie('textConverterProfiles');
    return profilesCookie ? JSON.parse(profilesCookie) : {};
}

/**
 * Saves all profiles to cookies
 * @param {Object} profiles - Object containing all profiles to save
 */
function saveProfiles(profiles) {
    setCookie('textConverterProfiles', JSON.stringify(profiles), COOKIE_EXPIRATION_DAYS);
}

/**
 * Gets current settings from all form elements
 * @param {Object} elements - DOM elements object
 * @returns {Object} Current settings object
 */
function getCurrentSettings(elements) {
    let activeSymbolButton = Array.from(elements.symbolButtons).find(btn => btn.classList.contains('active'));
    let symbolMode = activeSymbolButton ? activeSymbolButton.id : 'symbolButton1';
    
    return {
        firstLetterFont: elements.firstLetterFont.value,
        commaStyle: elements.commaStyle.value,
        punctuationStyle: elements.punctuationStyle.value,
        spaceStyle: elements.spaceStyle.value,
        uppercaseWordStyle: elements.uppercaseWordStyle.value,
        symbolMode: symbolMode,
        symbolFrequency: elements.symbolFrequencySlider.value,
        allowRepeatSymbols: elements.allowRepeatSymbols.checked,
        customSymbols: elements.symbolInput.value
    };
}

/**
 * Applies settings to all form elements
 * @param {Object} settings - Settings object to apply
 * @param {Object} elements - DOM elements object
 */
function applySettings(settings, elements) {
    if (!settings) return;
    
    // Apply basic select values
    if (settings.firstLetterFont) elements.firstLetterFont.value = settings.firstLetterFont;
    if (settings.commaStyle) elements.commaStyle.value = settings.commaStyle;
    if (settings.punctuationStyle) elements.punctuationStyle.value = settings.punctuationStyle;
    if (settings.spaceStyle) elements.spaceStyle.value = settings.spaceStyle;
    if (settings.uppercaseWordStyle) elements.uppercaseWordStyle.value = settings.uppercaseWordStyle;
    
    // Apply symbol settings
    if (settings.symbolMode) {
        elements.symbolButtons.forEach(btn => btn.classList.remove('active'));
        const activeButton = document.getElementById(settings.symbolMode);
        if (activeButton) {
            activeButton.classList.add('active');
            updateSymbolControls(settings.symbolMode, elements);
        }
    }
    
    if (settings.symbolFrequency) elements.symbolFrequencySlider.value = settings.symbolFrequency;
    if (settings.allowRepeatSymbols !== undefined) elements.allowRepeatSymbols.checked = settings.allowRepeatSymbols;
    if (settings.customSymbols) elements.symbolInput.value = settings.customSymbols;
    
    // Update output with new settings
    updateOutput(elements);
}

/**
 * Loads a specific profile
 * @param {string} profileName - Name of profile to load
 * @param {Object} elements - DOM elements object
 */
function loadProfile(profileName, elements) {
    const profiles = getProfiles();
    if (profiles[profileName]) {
        applySettings(profiles[profileName], elements);
    }
}

/**
 * Saves current settings as a profile
 * @param {string} profileName - Name for the new profile
 * @param {Object} elements - DOM elements object
 * @returns {boolean} Success status
 */
function saveProfile(profileName, elements) {
    if (!profileName) return false;
    
    const profiles = getProfiles();
    
    // Check if we've reached the max number of profiles
    if (Object.keys(profiles).length >= MAX_PROFILES && !profiles[profileName]) {
        alert(`You've reached the maximum of ${MAX_PROFILES} profiles. Please delete one before adding a new one.`);
        return false;
    }
    
    // Save current settings
    profiles[profileName] = getCurrentSettings(elements);
    saveProfiles(profiles);
    
    // Update profile select dropdown
    updateProfileSelect(elements.profileSelect, profileName);
    
    return true;
}

/**
 * Deletes a profile
 * @param {string} profileName - Name of profile to delete
 * @param {Object} elements - DOM elements object
 * @returns {boolean} Success status
 */
function deleteProfile(profileName, elements) {
    if (!profileName) return false;
    
    const profiles = getProfiles();
    if (profiles[profileName]) {
        delete profiles[profileName];
        saveProfiles(profiles);
        updateProfileSelect(elements.profileSelect);
        return true;
    }
    
    return false;
}

/**
 * Updates the profile selection dropdown
 * @param {HTMLElement} selectElement - The profile select dropdown
 * @param {string} [selectedProfile] - Optional profile to select
 */
function updateProfileSelect(selectElement, selectedProfile = null) {
    // Save the current selection if no profile is specified
    if (!selectedProfile) {
        selectedProfile = selectElement.value;
        // Don't keep 'create_new' as the selected value
        if (selectedProfile === 'create_new') {
            selectedProfile = '';
        }
    }
    
    // Clear existing options except the default
    while (selectElement.options.length > 1) {
        selectElement.remove(1);
    }
    
    // Add the "Create a New Profile" option
    const createNewOption = document.createElement('option');
    createNewOption.value = 'create_new';
    createNewOption.textContent = 'Create a New Profile';
    selectElement.appendChild(createNewOption);
    
    // Add profile options
    const profiles = getProfiles();
    Object.keys(profiles).forEach(profile => {
        const option = document.createElement('option');
        option.value = profile;
        option.textContent = profile;
        selectElement.appendChild(option);
    });
    
    // Set selected profile if it exists
    if (selectedProfile && (selectedProfile === '' || profiles[selectedProfile])) {
        selectElement.value = selectedProfile;
    } else {
        selectElement.value = '';
    }
}

/**
 * Shows a notification
 * @param {HTMLElement} notificationElement - The notification element
 * @param {string} message - Optional message to display
 */
function showNotification(notificationElement, message = null) {
    if (message) {
        notificationElement.textContent = message;
    }
    
    notificationElement.classList.add('show');
    
    setTimeout(() => {
        notificationElement.classList.remove('show');
    }, 2000);
}

/**
 * Sets a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Days until expiration
 */
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
}

/**
 * Gets a cookie value
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
function getCookie(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/**
 * Initializes the profile manager
 * @param {Object} elements - DOM elements object
 */
function initProfileManager(elements) {
    // Track the last selected profile
    elements.lastSelectedProfile = '';
    
    // Add profile dialog elements
    const profileDialog = document.createElement('div');
    profileDialog.id = 'profileDialog';
    profileDialog.className = 'profile-dialog';
    profileDialog.innerHTML = `
        <div class="profile-dialog-content">
            <h3>Create New Profile</h3>
            <input type="text" id="profileNameInput" placeholder="Enter profile name..." maxlength="30">
            <div class="profile-dialog-buttons">
                <button id="cancelProfileButton" class="profile-dialog-button cancel">Cancel</button>
                <button id="confirmProfileButton" class="profile-dialog-button save">Create</button>
            </div>
        </div>
    `;
    document.body.appendChild(profileDialog);
    
    // Get additional elements
    const additionalElements = {
        profileDialog: document.getElementById('profileDialog'),
        profileNameInput: document.getElementById('profileNameInput'),
        confirmProfileButton: document.getElementById('confirmProfileButton'),
        cancelProfileButton: document.getElementById('cancelProfileButton'),
        profileNotification: document.getElementById('profileNotification')
    };
    
    // Merge with existing elements
    Object.assign(elements, additionalElements);
    
    // Initialize profile select
    updateProfileSelect(elements.profileSelect);
    
    // Profile select change event
    elements.profileSelect.addEventListener('change', function() {
        if (this.value === 'create_new') {
            // Show dialog to create a new profile
            elements.profileNameInput.value = '';
            elements.profileDialog.classList.add('show');
            elements.profileNameInput.focus();
            // Reset selection to previous value after triggering dialog
            updateProfileSelect(elements.profileSelect, elements.lastSelectedProfile || '');
        } else if (this.value) {
            // Load the selected profile
            elements.lastSelectedProfile = this.value;
            loadProfile(this.value, elements);
        } else {
            // Reset to default settings if "Default Profile" is selected
            elements.lastSelectedProfile = '';
            resetToDefaultSettings(elements);
        }
    });
    
    // Save profile button click - saves settings to current profile
    elements.saveProfileButton.addEventListener('click', function() {
        const selectedProfile = elements.profileSelect.value;
        
        if (selectedProfile && selectedProfile !== 'create_new') {
            // Save settings to existing profile
            if (saveProfile(selectedProfile, elements)) {
                showNotification(elements.profileNotification, 'Profile updated!');
            }
        } else {
            // If no profile is selected or it's the create_new option, inform the user
            alert('Please select a profile to save your settings to, or create a new profile from the dropdown.');
        }
    });
    
    // Delete profile button click
    elements.deleteProfileButton.addEventListener('click', function() {
        const selectedProfile = elements.profileSelect.value;
        if (selectedProfile) {
            if (confirm(`Are you sure you want to delete the profile "${selectedProfile}"?`)) {
                if (deleteProfile(selectedProfile, elements)) {
                    showNotification(elements.profileNotification, 'Profile deleted!');
                }
            }
        } else {
            alert('Please select a profile to delete.');
        }
    });
    
    // Confirm profile creation
    elements.confirmProfileButton.addEventListener('click', function() {
        const profileName = elements.profileNameInput.value.trim();
        if (profileName) {
            if (saveProfile(profileName, elements)) {
                elements.profileDialog.classList.remove('show');
                showNotification(elements.profileNotification, 'Profile created!');
                // Select the newly created profile
                elements.lastSelectedProfile = profileName;
                updateProfileSelect(elements.profileSelect, profileName);
            }
        } else {
            alert('Please enter a profile name.');
        }
    });
    
    // Cancel profile save
    elements.cancelProfileButton.addEventListener('click', function() {
        elements.profileDialog.classList.remove('show');
    });
    
    // Close dialog when clicking outside
    elements.profileDialog.addEventListener('click', function(event) {
        if (event.target === this) {
            this.classList.remove('show');
        }
    });
    
    // Enter key in profile name input
    elements.profileNameInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            elements.confirmProfileButton.click();
        }
    });
}

/**
 * Resets all settings to default values
 * @param {Object} elements - DOM elements object
 */
function resetToDefaultSettings(elements) {
    // Reset all select elements
    elements.firstLetterFont.value = '';
    elements.commaStyle.value = '';
    elements.punctuationStyle.value = '';
    elements.spaceStyle.value = '';
    elements.uppercaseWordStyle.value = '';
    
    // Reset symbol settings
    elements.symbolButtons.forEach(btn => btn.classList.remove('active'));
    document.getElementById('symbolButton1').classList.add('active');
    updateSymbolControls('symbolButton1', elements);
    
    elements.symbolFrequencySlider.value = 50;
    elements.allowRepeatSymbols.checked = true;
    elements.symbolInput.value = '';
    
    // Update output with default settings
    updateOutput(elements);
}