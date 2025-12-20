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
    try {
        return profilesCookie ? JSON.parse(profilesCookie) : {};
    } catch (e) {
        console.error('Error parsing profiles cookie:', e);
        return {};
    }
}

/**
 * Saves all profiles to cookies
 * @param {Object} profiles - Object containing all profiles to save
 */
function saveProfiles(profiles) {
    try {
        setCookie('textConverterProfiles', JSON.stringify(profiles), COOKIE_EXPIRATION_DAYS);
        return true;
    } catch (e) {
        console.error('Error saving profiles:', e);
        return false;
    }
}

/**
 * Gets current settings from all form elements
 * @param {Object} elements - DOM elements object
 * @returns {Object} Current settings object
 */
function getCurrentSettings(elements) {
    let activeSymbolButton = Array.from(elements.symbolButtons).find(btn => btn.classList.contains('active'));
    let symbolMode = activeSymbolButton ? activeSymbolButton.id : 'symbolButton1';

    // Get spacing settings (default to 0 if not set)
    const spacing = elements.outputSpacing ? parseInt(elements.outputSpacing.value) || 0 : 0;

    return {
        firstLetterFont: elements.firstLetterFont.value,
        commaStyle: elements.commaStyle.value,
        punctuationStyle: elements.punctuationStyle.value,
        spaceStyle: elements.spaceStyle.value,
        uppercaseWordStyle: elements.uppercaseWordStyle.value,
        symbolMode: symbolMode,
        symbolFrequency: elements.symbolFrequencySlider.value,
        allowRepeatSymbols: elements.allowRepeatSymbols.checked,
        customSymbols: elements.symbolInput.value,
        spacing: spacing
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

    // Apply spacing settings
    if (elements.outputSpacing && settings.spacing !== undefined) {
        elements.outputSpacing.value = settings.spacing;
    }

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
    const saveSuccess = saveProfiles(profiles);
    
    if (saveSuccess) {
        // Update profile select dropdown
        updateProfileSelect(elements.profileSelect, profileName);
        return true;
    } else {
        alert('Failed to save profile. This might be due to browser storage limitations or privacy settings.');
        return false;
    }
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
        const saveSuccess = saveProfiles(profiles);
        
        if (saveSuccess) {
            // Reset the last selected profile if it was the deleted one
            if (elements.lastSelectedProfile === profileName) {
                elements.lastSelectedProfile = '';
            }
            updateProfileSelect(elements.profileSelect);
            return true;
        } else {
            alert('Failed to delete profile. This might be due to browser storage limitations or privacy settings.');
            return false;
        }
    }
    
    return false;
}

/**
 * Updates the profile selection dropdown with import/export options
 * @param {HTMLElement} selectElement - The profile select dropdown
 * @param {string} [selectedProfile] - Optional profile to select
 */
function updateProfileSelect(selectElement, selectedProfile = null) {
    // Store the current selection if no profile is specified
    if (!selectedProfile) {
        selectedProfile = selectElement.value;
        // Don't keep special actions as the selected value
        if (['create_new', 'export_current', 'import_profiles'].includes(selectedProfile)) {
            selectedProfile = '';
        }
    }
    
    // Clear all existing options
    selectElement.innerHTML = '';
    
    // Add default options
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Default Profile';
    selectElement.appendChild(defaultOption);
    
    const createNewOption = document.createElement('option');
    createNewOption.value = 'create_new';
    createNewOption.textContent = 'Create a New Profile';
    selectElement.appendChild(createNewOption);
    
    // Add profile options
    const profiles = getProfiles();
    const profileNames = Object.keys(profiles).sort();
    
    profileNames.forEach(profile => {
        const option = document.createElement('option');
        option.value = profile;
        option.textContent = profile;
        selectElement.appendChild(option);
    });
    
    // Add separator and import/export options
    if (profileNames.length > 0 || selectedProfile) {
        const separator = document.createElement('option');
        separator.disabled = true;
        separator.textContent = '━━━━━━━━━━━━━━━━━━';
        selectElement.appendChild(separator);
    }
    
    const exportCurrentOption = document.createElement('option');
    exportCurrentOption.value = 'export_current';
    exportCurrentOption.textContent = 'Export Current Profile';
    selectElement.appendChild(exportCurrentOption);
    
    const importOption = document.createElement('option');
    importOption.value = 'import_profiles';
    importOption.textContent = 'Import Profiles';
    selectElement.appendChild(importOption);
    
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
 * Sets a cookie with proper URL encoding
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Days until expiration
 */
function setCookie(name, value, days) {
    try {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        const encodedValue = encodeURIComponent(value);
        document.cookie = `${name}=${encodedValue};${expires};path=/;SameSite=Strict`;
        return true;
    } catch (e) {
        console.error('Error setting cookie:', e);
        return false;
    }
}

/**
 * Gets a cookie value with proper decoding
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
function getCookie(name) {
    try {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                const encodedValue = c.substring(nameEQ.length, c.length);
                return decodeURIComponent(encodedValue);
            }
        }
        return null;
    } catch (e) {
        console.error('Error getting cookie:', e);
        return null;
    }
}

/**
 * Tests if cookies are available and working
 * @returns {boolean} True if cookies are supported and enabled
 */
function testCookieSupport() {
    try {
        // Try to set a test cookie
        const testValue = "test";
        setCookie("cookieTest", testValue, 1);
        const cookieVal = getCookie("cookieTest");
        
        // Clean up test cookie
        document.cookie = "cookieTest=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        // Check if we got the same value back
        return cookieVal === testValue;
    } catch (e) {
        console.error("Cookie test failed:", e);
        return false;
    }
}

/**
 * Initializes the profile manager
 * @param {Object} elements - DOM elements object
 */
function initProfileManager(elements) {
    // Check if cookies are supported
    const cookiesSupported = testCookieSupport();
    if (!cookiesSupported) {
        // Show a notice about cookie limitations
        const cookieWarning = document.createElement('div');
        cookieWarning.className = 'notification';
        cookieWarning.style.backgroundColor = '#f44336';
        cookieWarning.textContent = 'Cookie storage not available. Profile saving won\'t work.';
        cookieWarning.style.opacity = '1';
        cookieWarning.style.visibility = 'visible';
        document.body.appendChild(cookieWarning);
        
        setTimeout(() => {
            cookieWarning.style.opacity = '0';
            setTimeout(() => {
                cookieWarning.remove();
            }, 1000);
        }, 5000);
    }
    
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
    
    // Profile select change event with improved mobile handling and import/export
    elements.profileSelect.addEventListener('change', function(e) {
        e.preventDefault();
        
        const selectedValue = this.value;
        
        if (selectedValue === 'create_new') {
            // Show dialog to create a new profile
            elements.profileNameInput.value = '';
            elements.profileDialog.classList.add('show');
            
            // On mobile, we need to be careful with focus as it can trigger virtual keyboard
            if (window.innerWidth > 768) {
                elements.profileNameInput.focus();
            }
            
            // Reset selection to previous value after triggering dialog
            setTimeout(() => {
                updateProfileSelect(elements.profileSelect, elements.lastSelectedProfile || '');
            }, 0);
            
        } else if (selectedValue === 'export_current') {
            // Export current profile
            exportCurrentProfile(elements);
            setTimeout(() => {
                updateProfileSelect(elements.profileSelect, elements.lastSelectedProfile || '');
            }, 0);
        } else if (selectedValue === 'import_profiles') {
            // Trigger import
            importProfiles();
            setTimeout(() => {
                updateProfileSelect(elements.profileSelect, elements.lastSelectedProfile || '');
            }, 0);
            
        } else if (selectedValue) {
            // Load the selected profile
            elements.lastSelectedProfile = selectedValue;
            loadProfile(selectedValue, elements);
            
        } else {
            // Reset to default settings if "Default Profile" is selected
            elements.lastSelectedProfile = '';
            resetToDefaultSettings(elements);
        }
    });
    
    // Save profile button click with improved error handling
    elements.saveProfileButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const selectedProfile = elements.profileSelect.value;
        
        if (selectedProfile && !['create_new', 'export_current', 'import_profiles'].includes(selectedProfile)) {
            // Save settings to existing profile
            if (saveProfile(selectedProfile, elements)) {
                showNotification(elements.profileNotification, 'Profile updated!');
            }
        } else {
            // If no profile is selected or it's a special option, inform the user
            alert('Please select a profile to save your settings to, or create a new profile.');
        }
    });
    
    // Delete profile button click with improved state management
    elements.deleteProfileButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const selectedProfile = elements.profileSelect.value;
        if (selectedProfile && !['create_new', 'export_current', 'import_profiles'].includes(selectedProfile)) {
            if (confirm(`Are you sure you want to delete the profile "${selectedProfile}"?`)) {
                if (deleteProfile(selectedProfile, elements)) {
                    showNotification(elements.profileNotification, 'Profile deleted!');
                }
            }
        } else {
            alert('Please select a profile to delete.');
        }
    });
    
    // Confirm profile creation with better error handling
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
            alert('Please enter a name for your profile.');
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
    
    // Handle browser back button to avoid weird states
    window.addEventListener('popstate', function() {
        // If the dialog is open, close it
        if (elements.profileDialog.classList.contains('show')) {
            elements.profileDialog.classList.remove('show');
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