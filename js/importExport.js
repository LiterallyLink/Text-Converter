/**
 * Import/Export Manager - Dropdown Integration Version
 * Handles importing and exporting profile data
 */

let importData = null;

/**
 * Exports the currently selected profile
 * @param {Object} elements - DOM elements object
 */
function exportCurrentProfile(elements) {
    const selectedProfile = elements.lastSelectedProfile;
    
    if (!selectedProfile || ['create_new', 'export_current', 'export_all', 'import_profiles'].includes(selectedProfile)) {
        // If no profile selected, export current settings as "Current Settings"
        const currentSettings = getCurrentSettings(elements);
        exportProfileData({ "Current Settings": currentSettings }, "current-settings");
    } else {
        // Export the selected profile
        const profiles = getProfiles();
        if (profiles[selectedProfile]) {
            const sanitizedName = selectedProfile.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            exportProfileData({ [selectedProfile]: profiles[selectedProfile] }, sanitizedName);
        } else {
            // If profile doesn't exist in saved profiles, export current settings
            const currentSettings = getCurrentSettings(elements);
            exportProfileData({ "Current Settings": currentSettings }, "current-settings");
        }
    }
}

/**
 * Triggers the file import dialog
 */
function importProfiles() {
    document.getElementById('importFileInput').click();
}

/**
 * Common export function
 * @param {Object} data - Profile data to export
 * @param {string} filenameSuffix - Suffix for the filename
 */
function exportProfileData(data, filenameSuffix) {
    try {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        
        // Create filename with current date
        const date = new Date().toISOString().split('T')[0];
        link.download = `text-converter-${filenameSuffix}-${date}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        URL.revokeObjectURL(link.href);
        
        const profileCount = Object.keys(data).length;
        const message = profileCount === 1 ? 'Profile exported successfully!' : `${profileCount} profiles exported successfully!`;
        showNotification(document.getElementById('profileNotification'), message);
    } catch (error) {
        console.error('Export error:', error);
        showNotification(document.getElementById('profileNotification'), 'Failed to export profile(s)');
    }
}

/**
 * Handles file selection for import - Auto-apply version
 * @param {Event} event - File input change event
 */
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.json')) {
        showNotification(document.getElementById('profileNotification'), 'Please select a valid JSON file');
        return;
    }

    // Check if there's room for new profiles first
    const currentProfiles = getProfiles();
    if (Object.keys(currentProfiles).length >= MAX_PROFILES) {
        showNotification(document.getElementById('profileNotification'), 'No available slots for profiles. Please delete some profiles first.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importData = JSON.parse(e.target.result);
            
            // Validate import data structure
            if (typeof importData !== 'object' || !importData) {
                throw new Error('Invalid file format');
            }

            const profileNames = Object.keys(importData);
            if (profileNames.length === 0) {
                showNotification(document.getElementById('profileNotification'), 'No profiles found in file');
                return;
            }

            let importedCount = 0;
            let skippedCount = 0;
            let firstImportedProfile = null;

            // Import each valid profile
            for (const [profileName, profile] of Object.entries(importData)) {
                if (typeof profile !== 'object' || !profile) {
                    console.warn(`Skipping invalid profile: ${profileName}`);
                    skippedCount++;
                    continue;
                }
                
                // Basic validation of required fields
                const requiredFields = ['firstLetterFont', 'commaStyle', 'punctuationStyle', 'spaceStyle', 'uppercaseWordStyle', 'symbolMode'];
                const hasValidStructure = requiredFields.some(field => profile.hasOwnProperty(field));
                
                if (!hasValidStructure) {
                    console.warn(`Skipping profile with invalid structure: ${profileName}`);
                    skippedCount++;
                    continue;
                }

                // Check if we still have room
                if (Object.keys(currentProfiles).length >= MAX_PROFILES) {
                    break;
                }

                // Add the profile (will overwrite if exists)
                currentProfiles[profileName] = profile;
                importedCount++;

                // Remember the first successfully imported profile
                if (!firstImportedProfile) {
                    firstImportedProfile = profileName;
                }
            }

            // Save the updated profiles
            if (importedCount > 0) {
                if (saveProfiles(currentProfiles)) {
                    // Get the elements object
                    const elements = window.textConverterElements;
                    
                    if (elements && firstImportedProfile) {
                        // Set the imported profile as current
                        elements.lastSelectedProfile = firstImportedProfile;
                        
                        // Update the dropdown to show new profiles
                        updateProfileSelect(elements.profileSelect, firstImportedProfile);
                        
                        // Apply the settings from the first imported profile
                        applySettings(currentProfiles[firstImportedProfile], elements);
                    }
                    
                    let message = `${importedCount} profile(s) imported successfully!`;
                    if (skippedCount > 0) {
                        message += ` (${skippedCount} skipped)`;
                    }
                    if (firstImportedProfile) {
                        message += ` Applied "${firstImportedProfile}" profile.`;
                    }
                    
                    showNotification(document.getElementById('profileNotification'), message);
                } else {
                    showNotification(document.getElementById('profileNotification'), 'Failed to save imported profiles');
                }
            } else {
                showNotification(document.getElementById('profileNotification'), 'No valid profiles found in file');
            }

        } catch (error) {
            console.error('Import error:', error);
            let errorMessage = 'Invalid profile file format';
            
            if (error.message.includes('JSON')) {
                errorMessage = 'File is not valid JSON format';
            }
            
            showNotification(document.getElementById('profileNotification'), errorMessage);
        }
    };
    
    reader.onerror = function() {
        showNotification(document.getElementById('profileNotification'), 'Error reading file');
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
}

/**
 * Shows the import preview modal (deprecated - kept for compatibility)
 * @param {Object} profiles - Profiles to be imported
 */
function showImportPreview(profiles) {
    // This function is no longer used with the simplified import flow
    console.warn('showImportPreview is deprecated in the simplified import flow');
}

/**
 * Confirms and processes the import (deprecated - kept for compatibility)
 * @param {Object} elements - DOM elements object
 */
function confirmImport(elements) {
    // This function is no longer used with the simplified import flow
    console.warn('confirmImport is deprecated in the simplified import flow');
}

/**
 * Initializes import/export functionality for dropdown integration
 * @param {Object} elements - DOM elements object
 */
function initImportExport(elements) {
    // Add file input to elements
    const fileInput = document.getElementById('importFileInput');
    
    if (!fileInput) {
        console.error('Import file input not found');
        return;
    }
    
    elements.fileInput = fileInput;
    
    // Event listeners
    elements.fileInput.addEventListener('change', handleFileSelect);
    
    // Store elements globally for import access
    window.textConverterElements = elements;
    
    console.log('Import/Export functionality initialized');
}