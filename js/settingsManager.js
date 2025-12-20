/**
 * Settings Manager
 * Handles the settings modal for configuring per-profile settings
 */

/**
 * Opens the settings modal and loads profiles
 */
function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    const profileSelect = document.getElementById('settingsProfileSelect');

    // Populate profile dropdown
    updateSettingsProfileSelect(profileSelect);

    // Load settings for currently selected profile
    loadSettingsForProfile(profileSelect.value);

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

    // Clear existing options except default
    select.innerHTML = '<option value="">Default Profile</option>';

    // Add all saved profiles
    for (const profileName in profiles) {
        const option = document.createElement('option');
        option.value = profileName;
        option.textContent = profileName;
        select.appendChild(option);
    }
}

/**
 * Loads settings for a specific profile into the settings modal
 * @param {string} profileName - Name of the profile to load
 */
function loadSettingsForProfile(profileName) {
    const spacingSelect = document.getElementById('outputSpacing');

    if (!profileName) {
        // Default profile - reset to 0
        spacingSelect.value = 0;
        return;
    }

    const profiles = getProfiles();
    const profile = profiles[profileName];

    if (profile) {
        spacingSelect.value = profile.spacing || 0;
    }
}

/**
 * Saves the current settings to the selected profile
 */
function saveSettingsForProfile() {
    const profileSelect = document.getElementById('settingsProfileSelect');
    const profileName = profileSelect.value;
    const spacing = parseInt(document.getElementById('outputSpacing').value) || 0;

    if (!profileName) {
        // For default profile, just update the current page's spacing input
        const elements = window.textConverterElements;
        if (elements && elements.outputSpacing) {
            elements.outputSpacing.value = spacing;
            updateOutput(elements);
        }

        showNotification('Settings applied to current session!', 'profileNotification');
        closeSettingsModal();
        return;
    }

    const profiles = getProfiles();
    const profile = profiles[profileName];

    if (profile) {
        // Update the profile with new spacing settings
        profile.spacing = spacing;

        // Save profiles back to cookies
        if (saveProfiles(profiles)) {
            showNotification('Profile settings saved!', 'profileNotification');

            // If this is the currently active profile, apply the settings immediately
            const elements = window.textConverterElements;
            if (elements && elements.profileSelect && elements.profileSelect.value === profileName) {
                applySettings(profile, elements);
            }

            closeSettingsModal();
        } else {
            alert('Failed to save settings. Please try again.');
        }
    } else {
        alert('Profile not found. Please select a valid profile.');
    }
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
