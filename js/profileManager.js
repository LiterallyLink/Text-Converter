/**
 * Profile Manager
 * Handles saving, loading, and managing user profiles using localStorage
 */

// Maximum number of allowed profiles
const MAX_PROFILES = 8;

// localStorage key for profiles
const PROFILES_STORAGE_KEY = 'textConverterProfiles';

/**
 * Migrates profiles from cookies to localStorage (one-time)
 * Existing users who had profiles in cookies will have them moved over automatically
 */
function migrateProfilesFromCookies() {
    // If localStorage already has profiles, skip migration
    if (localStorage.getItem(PROFILES_STORAGE_KEY)) return;

    // Check if there are profiles in the old cookie
    const cookieData = getCookie('textConverterProfiles');
    if (cookieData) {
        try {
            const profiles = JSON.parse(cookieData);
            if (profiles && typeof profiles === 'object' && Object.keys(profiles).length > 0) {
                localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
                // Clear the old cookie
                document.cookie = 'textConverterProfiles=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                console.log(`Migrated ${Object.keys(profiles).length} profile(s) from cookies to localStorage`);
            }
        } catch (e) {
            console.error('Error migrating profiles from cookies:', e);
        }
    }
}

/**
 * Gets all saved profiles from localStorage
 * @returns {Object} Object containing all saved profiles
 */
function getProfiles() {
    try {
        const data = localStorage.getItem(PROFILES_STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        console.error('Error reading profiles:', e);
        return {};
    }
}

/**
 * Saves all profiles to localStorage
 * @param {Object} profiles - Object containing all profiles to save
 */
function saveProfiles(profiles) {
    try {
        localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
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
    const linePadding = elements.linePadding ? parseInt(elements.linePadding.value) || 0 : 0;

    return {
        firstLetterFont: elements.firstLetterFont.value,
        exclamationStyle: elements.exclamationStyle.value,
        questionStyle: elements.questionStyle.value,
        commaStyle: elements.commaStyle.value,
        quoteStyle: elements.quoteStyle.value,
        spaceStyle: elements.spaceStyle.value,
        uppercaseWordStyle: elements.uppercaseWordStyle.value,
        numberStyle: elements.numberStyle.value,
        symbolMode: symbolMode,
        symbolFrequency: elements.symbolFrequencySlider.value,
        allowRepeatSymbols: elements.allowRepeatSymbols.checked,
        customSymbols: elements.symbolInput.value,
        enabledSymbols: (() => {
            const picker = document.getElementById('symbolPicker');
            if (!picker) return null;
            return [...picker.querySelectorAll('.symbol-picker-btn')].map(btn => btn.classList.contains('active'));
        })(),
        spacing: spacing,
        linePadding: linePadding,
        textAlignment: elements.textAlignment ? elements.textAlignment.value === 'true' : false,
        alignmentWidth: elements.alignmentWidth ? parseInt(elements.alignmentWidth.value) || 35 : 35
    };
}

/**
 * Applies settings to all form elements
 * @param {Object} settings - Settings object to apply
 * @param {Object} elements - DOM elements object
 */
function applySettings(settings, elements) {
    if (!settings) {
        // If no settings, reset to defaults
        resetToDefaults(elements);
        return;
    }

    // Apply basic select values (use empty string as default)
    elements.firstLetterFont.value = settings.firstLetterFont || '';
    elements.exclamationStyle.value = settings.exclamationStyle || '';
    elements.questionStyle.value = settings.questionStyle || '';
    elements.commaStyle.value = settings.commaStyle || '';
    elements.quoteStyle.value = settings.quoteStyle || '';
    elements.spaceStyle.value = settings.spaceStyle || '';
    elements.uppercaseWordStyle.value = settings.uppercaseWordStyle || '';
    elements.numberStyle.value = settings.numberStyle || '';

    // Apply symbol settings (default to None/symbolButton1)
    const symbolMode = settings.symbolMode || 'symbolButton1';
    elements.symbolButtons.forEach(btn => btn.classList.remove('active'));
    const activeButton = document.getElementById(symbolMode);
    if (activeButton) {
        activeButton.classList.add('active');
        updateSymbolControls(symbolMode, elements);
    }

    elements.symbolFrequencySlider.value = settings.symbolFrequency || '50';
    elements.allowRepeatSymbols.checked = settings.allowRepeatSymbols !== undefined ? settings.allowRepeatSymbols : true;
    elements.symbolInput.value = settings.customSymbols || '';

    // Restore which symbols are enabled in the picker
    if (Array.isArray(settings.enabledSymbols)) {
        const picker = document.getElementById('symbolPicker');
        if (picker) {
            const btns = [...picker.querySelectorAll('.symbol-picker-btn')];
            btns.forEach((btn, i) => {
                btn.classList.toggle('active', settings.enabledSymbols[i] !== false);
            });
        }
    }

    // Apply spacing settings (default to 0)
    const spacingVal = settings.spacing !== undefined ? settings.spacing : 0;
    setSpacingPreference(spacingVal);
    if (elements.outputSpacing) {
        elements.outputSpacing.value = spacingVal;
    }

    // Apply line padding (default to 0)
    const paddingVal = settings.linePadding !== undefined ? settings.linePadding : 0;
    setLinePaddingPreference(paddingVal);
    if (elements.linePadding) {
        elements.linePadding.value = paddingVal;
    }

    // Apply text alignment setting
    if (elements.textAlignment) {
        const enabled = settings.textAlignment !== undefined ? settings.textAlignment : false;
        elements.textAlignment.value = enabled.toString();
        setTextAlignmentPreference(enabled);
    }

    // Apply alignment width
    if (elements.alignmentWidth) {
        const width = settings.alignmentWidth !== undefined ? settings.alignmentWidth : 35;
        elements.alignmentWidth.value = width;
        setAlignmentWidthPreference(width);
    }

    // Update output with new settings
    updateOutput(elements);
}

/**
 * Resets all form elements to default values
 * @param {Object} elements - DOM elements object
 */
function resetToDefaults(elements) {
    // Reset all selects to empty string (first option)
    elements.firstLetterFont.value = '';
    elements.exclamationStyle.value = '';
    elements.questionStyle.value = '';
    elements.commaStyle.value = '';
    elements.quoteStyle.value = '';
    elements.spaceStyle.value = '';
    elements.uppercaseWordStyle.value = '';
    elements.numberStyle.value = '';

    // Reset symbol settings
    elements.symbolButtons.forEach(btn => btn.classList.remove('active'));
    const defaultButton = document.getElementById('symbolButton1');
    if (defaultButton) {
        defaultButton.classList.add('active');
        updateSymbolControls('symbolButton1', elements);
    }

    elements.symbolFrequencySlider.value = '50';
    elements.allowRepeatSymbols.checked = true;
    elements.symbolInput.value = '';

    // Reset symbol picker — re-enable all symbols
    const pickerOnReset = document.getElementById('symbolPicker');
    if (pickerOnReset) {
        pickerOnReset.querySelectorAll('.symbol-picker-btn').forEach(btn => btn.classList.add('active'));
    }

    // Reset spacing
    if (elements.outputSpacing) {
        elements.outputSpacing.value = 0;
    }

    // Reset line padding
    if (elements.linePadding) {
        elements.linePadding.value = 0;
    }

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
                localStorage.setItem('lastSelectedProfile', '');
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
        separator.textContent = '━━━━━━━━━━';
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
 * Active timeout ID for the notification, so repeated calls
 * don't cause the previous timer to steal the .show class.
 */
let notificationTimeout = null;

/**
 * Shows a notification
 * @param {HTMLElement} notificationElement - The notification element
 * @param {string} message - Optional message to display
 */
function showNotification(notificationElement, message = null) {
    if (message) {
        notificationElement.textContent = message;
    }

    // Cancel any pending hide so it doesn't steal our .show class
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }

    notificationElement.classList.add('show');

    notificationTimeout = setTimeout(() => {
        notificationElement.classList.remove('show');
        notificationTimeout = null;
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
    // Migrate any profiles stored in cookies (one-time for existing users)
    migrateProfilesFromCookies();

    // Check if localStorage is available
    try {
        localStorage.setItem('storageTest', 'test');
        localStorage.removeItem('storageTest');
    } catch (e) {
        const storageWarning = document.createElement('div');
        storageWarning.className = 'notification';
        storageWarning.style.backgroundColor = '#f44336';
        storageWarning.textContent = 'Local storage not available. Profile saving won\'t work.';
        storageWarning.style.opacity = '1';
        storageWarning.style.visibility = 'visible';
        document.body.appendChild(storageWarning);

        setTimeout(() => {
            storageWarning.style.opacity = '0';
            setTimeout(() => {
                storageWarning.remove();
            }, 1000);
        }, 5000);
    }

    // Track the last selected profile - restore from localStorage if available
    const savedProfile = localStorage.getItem('lastSelectedProfile') || '';
    elements.lastSelectedProfile = savedProfile;

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

    // Restore previously selected profile on page load
    if (savedProfile) {
        const profiles = getProfiles();
        if (profiles[savedProfile]) {
            elements.profileSelect.value = savedProfile;
            loadProfile(savedProfile, elements);
        } else {
            // Profile was deleted or doesn't exist anymore - reset
            elements.lastSelectedProfile = '';
            localStorage.setItem('lastSelectedProfile', '');
        }
    }

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
            localStorage.setItem('lastSelectedProfile', selectedValue);
            loadProfile(selectedValue, elements);

        } else {
            // Reset to default settings if "Default Profile" is selected
            elements.lastSelectedProfile = '';
            localStorage.setItem('lastSelectedProfile', '');
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
                localStorage.setItem('lastSelectedProfile', profileName);
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
    elements.exclamationStyle.value = '';
    elements.questionStyle.value = '';
    elements.commaStyle.value = '';
    elements.quoteStyle.value = '';
    elements.spaceStyle.value = '';
    elements.uppercaseWordStyle.value = '';
    elements.numberStyle.value = '';

    // Reset symbol settings
    elements.symbolButtons.forEach(btn => btn.classList.remove('active'));
    document.getElementById('symbolButton1').classList.add('active');
    updateSymbolControls('symbolButton1', elements);

    elements.symbolFrequencySlider.value = 50;
    elements.allowRepeatSymbols.checked = true;
    elements.symbolInput.value = '';

    // Reset symbol picker — re-enable all symbols
    const pickerOnDefault = document.getElementById('symbolPicker');
    if (pickerOnDefault) {
        pickerOnDefault.querySelectorAll('.symbol-picker-btn').forEach(btn => btn.classList.add('active'));
    }

    // Reset spacing to 0
    if (elements.outputSpacing) {
        elements.outputSpacing.value = 0;
    }

    // Reset line padding to 0
    if (elements.linePadding) {
        elements.linePadding.value = 0;
    }

    // Update output with default settings
    updateOutput(elements);
}