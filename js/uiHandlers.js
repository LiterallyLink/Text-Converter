/**
 * UI Handler Functions
 * Contains all functions that handle user interface interactions
 */

/**
 * Copies the output text to clipboard
 * @param {Object} elements - DOM elements object
 */
async function copyToClipboard(elements) {
    const textToCopy = elements.output.textContent;
    
    try {
        await navigator.clipboard.writeText(textToCopy);
        elements.copyButton.classList.add('copied');
        elements.copyNotification.classList.add('show');
        
        setTimeout(() => {
            elements.copyButton.classList.remove('copied');
            elements.copyNotification.classList.remove('show');
        }, 2000);
    } catch (err) {
        console.error('Failed to copy text:', err);
    }
}

/**
 * Updates symbol controls visibility
 * @param {string} buttonId - ID of the clicked button
 * @param {Object} elements - DOM elements object
 */
function updateSymbolControls(buttonId, elements) {
    elements.symbolButtons.forEach(btn => btn.classList.remove('active'));
    const button = document.getElementById(buttonId);
    if (button) button.classList.add('active');
    
    if (buttonId === 'symbolButton2' || buttonId === 'symbolButton3') {
        elements.symbolControls.style.display = 'block';
        elements.symbolInput.style.display = buttonId === 'symbolButton3' ? 'block' : 'none';
    } else {
        elements.symbolControls.style.display = 'none';
    }
}

/**
 * Handles theme changes
 * @param {Event} event - Change event
 */
function handleThemeChange(event) {
    const theme = event.target.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

/**
 * Loads the theme from local storage
 * @param {Object} elements - DOM elements object
 */
function loadTheme(elements) {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            elements.themeToggle.checked = true;
        }
    }
}

/**
 * Loads changelog content into the modal
 * @param {Element} changelogContent - Changelog content container
 */
async function loadChangelog(changelogContent) {
    try {
        const response = await fetch('changelog.txt');
        const text = await response.text();

        // Clear existing content
        changelogContent.textContent = '';

        // Parse changelog into versions
        const lines = text.split('\n');
        let currentVersion = null;
        let currentChanges = [];

        lines.forEach(line => {
            if (line.startsWith('Version ')) {
                // Save previous version if it exists
                if (currentVersion) {
                    createChangelogSection(changelogContent, currentVersion, currentChanges);
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
            createChangelogSection(changelogContent, currentVersion, currentChanges);
        }
    } catch (error) {
        changelogContent.textContent = '';
        const errorP = document.createElement('p');
        errorP.textContent = 'Error loading changelog.';
        changelogContent.appendChild(errorP);
    }
}

/**
 * Creates a collapsible changelog section
 * @param {Element} container - Container element
 * @param {string} version - Version header text
 * @param {Array} changes - Array of change descriptions
 */
function createChangelogSection(container, version, changes) {
    // Create version header (clickable)
    const header = document.createElement('div');
    header.className = 'changelog-version';
    header.textContent = version;

    // Create changes container (collapsible)
    const changesDiv = document.createElement('div');
    changesDiv.className = 'changelog-changes';

    changes.forEach(change => {
        const p = document.createElement('p');
        p.textContent = change;
        changesDiv.appendChild(p);
    });

    // Toggle functionality
    header.addEventListener('click', () => {
        header.classList.toggle('active');
        changesDiv.classList.toggle('show');
    });

    container.appendChild(header);
    container.appendChild(changesDiv);
}

/**
 * Opens the changelog modal
 * @param {Event} event - Click event
 * @param {Element} changelogModal - Modal element
 * @param {Element} changelogContent - Changelog content container
 */
function openChangelogModal(event, changelogModal, changelogContent) {
    event.preventDefault();
    changelogModal.style.display = 'block';
    loadChangelog(changelogContent);
}

/**
 * Closes the changelog modal
 * @param {Element} changelogModal - Modal element
 */
function closeChangelogModal(changelogModal) {
    changelogModal.style.display = 'none';
}

/**
 * Handles window clicks for modal closing
 * @param {Event} event - Click event
 * @param {Element} changelogModal - Modal element
 */
function handleWindowClick(event, changelogModal) {
    if (event.target === changelogModal) {
        changelogModal.style.display = 'none';
    }
}