/**
 * Single source of truth for text transformation controls.
 * Renders identical option sets into both the main page and the settings modal.
 */

const CONTROL_DEFINITIONS = [
    {
        id: 'firstLetterFont',
        settingsId: 'settingsFirstLetterFont',
        label: 'First Letter Style',
        mainLabel: 'Select First Letter Style',
        ariaLabel: 'First letter font style',
        options: [
            { value: '', text: 'Select First Letter Style' },
            { value: 'cursive', text: 'Cursive' },
            { value: 'gothic', text: 'Gothic' },
            { value: 'bold', text: 'Bold' },
        ]
    },
    {
        type: 'group',
        groupLabel: 'Punctuation Style',
        controls: [
            {
                id: 'exclamationStyle',
                settingsId: 'settingsExclamationStyle',
                label: '!',
                ariaLabel: 'Exclamation mark replacement style',
                options: [
                    { value: '', text: '!' },
                    { value: '\u2800ׅ⎖', text: 'ׅ⎖' },
                    { value: '.ᐟ', text: '.ᐟ' },
                    { value: '₊ᐟ', text: '₊ᐟ' },
                ]
            },
            {
                id: 'questionStyle',
                settingsId: 'settingsQuestionStyle',
                label: '?',
                ariaLabel: 'Question mark replacement style',
                options: [
                    { value: '', text: '?' },
                    { value: '\u2800ׅ𖤠', text: 'ׅ𖤠' },
                    { value: '.ᐣ', text: '.ᐣ' },
                    { value: '₊ᐣ', text: '₊ᐣ' },
                ]
            },
            {
                id: 'commaStyle',
                settingsId: 'settingsCommaStyle',
                label: ',',
                ariaLabel: 'Comma replacement style',
                options: [
                    { value: '', text: ',' },
                    { value: '、', text: '、' },
                    { value: '⸝⸝', text: '⸝⸝' },
                    { value: '◞', text: '◞' },
                    { value: '،،̲', text: '،،̲' },
                    { value: '⸝', text: '⸝' },
                ]
            },
            {
                id: 'quoteStyle',
                settingsId: 'settingsQuoteStyle',
                label: '" "',
                ariaLabel: 'Quotation mark replacement style',
                options: [
                    { value: '', text: '" "' },
                    { value: '❛,❜', text: '❛ ❜' },
                    { value: '❝,❞', text: '❝ ❞' },
                ]
            },
        ]
    },
    {
        id: 'spaceStyle',
        settingsId: 'settingsSpaceStyle',
        label: 'Space Style',
        mainLabel: 'Select Space Style',
        ariaLabel: 'Space replacement style',
        options: [
            { value: '', text: 'Select Space Style' },
            { value: 'thin-space', text: 'Thin Space' },
            { value: 'hair-space', text: 'Hair Space' },
            { value: 'figure-space', text: 'Figure Space' },
            { value: 'punctuation-space', text: 'Punctuation Space' },
            { value: 'em-quad', text: 'Em Quad Space' },
            { value: 'en-quad', text: 'En Quad Space' },
        ]
    },
    {
        id: 'uppercaseWordStyle',
        settingsId: 'settingsUppercaseWordStyle',
        label: 'Uppercase Word Style',
        mainLabel: 'Select Uppercase Word Style',
        ariaLabel: 'Uppercase word style',
        options: [
            { value: '', text: 'Select Uppercase Word Style' },
            { value: 'gothic', text: 'Gothic' },
            { value: 'bold', text: 'Bold' },
            { value: 'serif-bold', text: 'Serif Bold' },
            { value: 'italic', text: 'Italic' },
            { value: 'serif-bold-italic', text: 'Serif Bold Italic' },
            { value: 'bold-italic', text: 'Bold Italic' },
            { value: 'cryptic-italic', text: 'Cryptic Italic' },
        ]
    },
];

const SYMBOL_BUTTONS = [
    { id: 'symbolButton1', settingsId: 'settingsSymbolButton1', text: 'None', defaultActive: true },
    { id: 'symbolButton2', settingsId: 'settingsSymbolButton2', text: 'Random', defaultActive: false },
    { id: 'symbolButton3', settingsId: 'settingsSymbolButton3', text: 'Custom', defaultActive: false },
];

/**
 * Renders transformation controls into a container.
 * @param {string} containerId - Target container element ID
 * @param {'main'|'settings'} mode - Which ID set to use
 */
function renderControls(containerId, mode) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const isSettings = mode === 'settings';
    let html = '';

    // Select controls
    for (const def of CONTROL_DEFINITIONS) {
        if (def.type === 'group') {
            // Render a grouped row of small inline selects
            html += `<label>${def.groupLabel}</label>\n`;
            html += `<div class="punctuation-row">\n`;
            for (const ctrl of def.controls) {
                const selectId = isSettings ? ctrl.settingsId : ctrl.id;
                html += `    <div class="punctuation-row-item">\n`;
                html += `        <label for="${selectId}">${ctrl.label}</label>\n`;
                html += `        <select id="${selectId}" aria-label="${ctrl.ariaLabel}">\n`;
                for (const opt of ctrl.options) {
                    html += `            <option value="${escapeAttr(opt.value)}">${escapeHtml(opt.text)}</option>\n`;
                }
                html += `        </select>\n`;
                html += `    </div>\n`;
            }
            html += `</div>\n\n`;
        } else {
            const selectId = isSettings ? def.settingsId : def.id;
            const labelText = isSettings ? def.label : def.mainLabel;
            const forAttr = selectId;

            html += `<label for="${forAttr}">${labelText}</label>\n`;
            html += `<select id="${selectId}" aria-label="${def.ariaLabel}">\n`;
            for (const opt of def.options) {
                html += `    <option value="${escapeAttr(opt.value)}">${escapeHtml(opt.text)}</option>\n`;
            }
            html += `</select>\n\n`;
        }
    }

    // Symbol section
    const sectionClass = isSettings ? 'symbol-section-settings' : 'symbol-section';
    const controlsId = isSettings ? 'settingsSymbolControls' : 'symbolControls';
    const frequencyId = isSettings ? 'settingsSymbolFrequency' : 'symbolFrequency';
    const repeatId = isSettings ? 'settingsAllowRepeatSymbols' : 'allowRepeatSymbols';
    const inputId = isSettings ? 'settingsSymbolInput' : 'symbolInput';
    const typeAttr = isSettings ? ' type="button"' : '';
    const controlsDisplay = isSettings ? ' style="display: none;"' : '';

    html += `<div class="${sectionClass}">\n`;
    html += `    <label class="symbol-label">\n`;
    html += `        Symbol Style\n`;
    html += `        <span class="experimental-tag" title="This feature is experimental and may be changed in the future.">Experimental</span>\n`;
    html += `    </label>\n`;
    html += `    <div class="symbol-buttons">\n`;
    for (const btn of SYMBOL_BUTTONS) {
        const btnId = isSettings ? btn.settingsId : btn.id;
        const activeClass = btn.defaultActive ? ' active' : '';
        html += `        <button id="${btnId}" class="symbol-button${activeClass}"${typeAttr}>${btn.text}</button>\n`;
    }
    html += `    </div>\n`;
    html += `    <div id="${controlsId}"${controlsDisplay}>\n`;
    html += `        <div class="slider-container">\n`;
    html += `            <label for="${frequencyId}">Symbol Frequency</label>\n`;
    html += `            <div class="slider-wrapper">\n`;
    html += `                <input type="range" id="${frequencyId}" min="0" max="100" value="50">\n`;
    html += `                <div class="slider-labels">\n`;
    html += `                    <span>Minimal</span>\n`;
    html += `                    <span>Moderate</span>\n`;
    html += `                    <span>Frequent</span>\n`;
    html += `                </div>\n`;
    html += `            </div>\n`;
    html += `        </div>\n`;
    html += `        <div class="checkbox-container">\n`;
    html += `            <label class="checkbox-label">\n`;
    html += `                <input type="checkbox" id="${repeatId}" checked>\n`;
    html += `                <span class="checkmark"></span>\n`;
    html += `                Allow Repeat Symbols\n`;
    html += `            </label>\n`;
    html += `        </div>\n`;
    html += `        <input type="text" id="${inputId}" placeholder="Enter custom symbols...">\n`;
    html += `    </div>\n`;
    html += `</div>\n`;

    container.insertAdjacentHTML('beforeend', html);
}

/** Escape HTML special characters for text content */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/** Escape for use inside HTML attribute values */
function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
