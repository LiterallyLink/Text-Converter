/**
 * Text Transformation Functions
 * Contains all functions that manipulate and transform text
 */

/**
 * Replaces the first letter with a styled version based on selected font
 * @param {string} text - Input text
 * @param {string} fontStyle - Selected font style
 * @returns {string} Text with styled first letter
 */
function replaceFirstLetter(text, fontStyle) {
    if (!fontStyle) return text;

    const firstLetter = text.charAt(0);
    const replacementLetter = FIRST_LETTER_FONTS[fontStyle]?.[firstLetter] || firstLetter;
    return replacementLetter + text.slice(1);
}

/**
 * Replaces completely uppercase words with selected style
 * @param {string} text - Input text
 * @param {string} uppercaseStyle - Selected uppercase word style
 * @returns {string} Text with styled uppercase words
 */
function replaceUppercaseWords(text, uppercaseStyle) {
    if (!uppercaseStyle) return text;

    const styleFunction = UPPERCASE_WORD_STYLES[uppercaseStyle].transform;
    
    return text.split(/\b/).map(word => {
        if (word.length > 0 && word === word.toUpperCase() && /[A-Z]/.test(word)) {
            return styleFunction(word);
        }
        return word;
    }).join('');
}

/**
 * Replaces commas with selected style
 * @param {string} text - Input text
 * @param {string} commaStyle - Selected comma style
 * @returns {string} Text with replaced commas
 */
function replaceCommas(text, commaStyle) {
    return commaStyle ? text.split(',').join(commaStyle) : text;
}

/**
 * Replaces punctuation with selected style
 * @param {string} text - Input text
 * @param {string} punctuationStyle - Selected punctuation style
 * @returns {string} Text with replaced punctuation
 */
function replacePunctuation(text, punctuationStyle) {
    if (!punctuationStyle) return text;

    const [exclamationStyle, questionStyle] = punctuationStyle.split(',');
    return text
        .replace(/!/g, exclamationStyle)
        .replace(/\?/g, questionStyle);
}

/**
 * Replaces spaces with selected space style
 * @param {string} text - Input text
 * @param {string} spaceStyle - Selected space style
 * @returns {string} Text with replaced spaces
 */
function replaceSpaces(text, spaceStyle) {
    if (!spaceStyle) return text;

    const spaceChar = SPACE_STYLES[spaceStyle];
    return spaceChar ? text.replace(/ /g, spaceChar) : text;
}

/**
 * Adds symbols to text based on selected style and frequency
 * @param {string} text - Input text
 * @param {Object} elements - DOM elements object
 * @returns {string} Text with added symbols
 */
function addSymbols(text, elements) {
    const activeButton = document.querySelector('.symbol-button.active');
    if (!activeButton || activeButton.id === 'symbolButton1') return text;

    const frequency = elements.symbolFrequencySlider.value / 100;
    const spaceStyle = elements.spaceStyle.value;
    const spaceChar = SPACE_STYLES[spaceStyle] || ' ';
    
    // Split text by spaces only (preserve newlines)
    const words = text.split(/ +/);
    const allowRepeats = elements.allowRepeatSymbols.checked;
    
    if (activeButton.id === 'symbolButton2') {
        // Random symbols
        let availableSymbols = [...RANDOM_SYMBOLS];
        let currentIndex = 0;
        
        return words.map((word, index) => {
            if (Math.random() < frequency) {
                let symbol;
                if (allowRepeats) {
                    symbol = RANDOM_SYMBOLS[Math.floor(Math.random() * RANDOM_SYMBOLS.length)];
                } else {
                    if (currentIndex >= availableSymbols.length) {
                        availableSymbols = [...RANDOM_SYMBOLS];
                        currentIndex = 0;
                    }
                    const randomIndex = Math.floor(Math.random() * availableSymbols.length);
                    symbol = availableSymbols[randomIndex];
                    availableSymbols.splice(randomIndex, 1);
                    currentIndex++;
                }
                return index === words.length - 1 ? `${word}${spaceChar}${symbol}` : `${word}${spaceChar}${symbol}${spaceChar}`;
            }
            return index === words.length - 1 ? word : word + spaceChar;
        }).join('');
    } else if (activeButton.id === 'symbolButton3') {
        // Custom symbols
        const customSymbols = elements.symbolInput.value.split('');
        if (customSymbols.length === 0) return text;
        
        let availableSymbols = [...customSymbols];
        let currentIndex = 0;
        
        return words.map((word, index) => {
            if (Math.random() < frequency) {
                let symbol;
                if (allowRepeats) {
                    symbol = customSymbols[Math.floor(Math.random() * customSymbols.length)];
                } else {
                    if (currentIndex >= availableSymbols.length) {
                        availableSymbols = [...customSymbols];
                        currentIndex = 0;
                    }
                    const randomIndex = Math.floor(Math.random() * availableSymbols.length);
                    symbol = availableSymbols[randomIndex];
                    availableSymbols.splice(randomIndex, 1);
                    currentIndex++;
                }
                return index === words.length - 1 ? `${word}${spaceChar}${symbol}` : `${word}${spaceChar}${symbol}${spaceChar}`;
            }
            return index === words.length - 1 ? word : word + spaceChar;
        }).join('');
    }
    
    return text;
}

/**
 * Updates the output with processed text
 * @param {Object} elements - DOM elements object
 */
function updateOutput(elements) {
    let processedText = elements.inputText.value;
    if (!processedText) {
        elements.output.innerHTML = '';
        return;
    }

    // Apply text transformations in the correct order
    processedText = replaceFirstLetter(
        processedText,
        elements.firstLetterFont.value
    );
    processedText = replaceUppercaseWords(
        processedText,
        elements.uppercaseWordStyle.value
    );
    processedText = replaceCommas(
        processedText,
        elements.commaStyle.value
    );
    processedText = replacePunctuation(
        processedText,
        elements.punctuationStyle.value
    );
    // Add symbols before replacing spaces
    processedText = addSymbols(processedText, elements);
    // Replace spaces last to ensure consistent spacing
    processedText = replaceSpaces(
        processedText,
        elements.spaceStyle.value
    );

    // Apply text alignment (word wrap) before spacing
    processedText = applyTextAlignment(processedText, elements);

    // Apply spacing settings (newlines before and after)
    processedText = applySpacing(processedText, elements);

    elements.output.innerHTML = processedText;
}

/**
 * Wraps text using minimum raggedness algorithm for balanced line lengths.
 * Splits on any Unicode whitespace to handle special space characters.
 * @param {string} text - Input text (may contain Unicode spaces and symbols)
 * @param {Object} elements - DOM elements object
 * @returns {string} Text with line breaks inserted
 */
function applyTextAlignment(text, elements) {
    const enabled = elements.textAlignment ? elements.textAlignment.value === 'true' : false;
    if (!enabled) return text;

    const maxWidth = 35;
    // Match any Unicode whitespace character (but not newlines)
    const spacePattern = /[^\S\n]+/;
    const lines = text.split('\n');
    const wrappedLines = [];

    for (const line of lines) {
        // Split on any whitespace, capture the separator to preserve special spaces
        const parts = line.split(spacePattern);
        const words = parts.filter(w => w.length > 0);
        if (words.length <= 1) {
            wrappedLines.push(line);
            continue;
        }

        // Detect which space character is used in this line
        const spaceMatch = line.match(/[^\S\n]/);
        const spaceChar = spaceMatch ? spaceMatch[0] : ' ';

        const totalChars = words.reduce((sum, w) => sum + w.length, 0);
        const totalWithSpaces = totalChars + (words.length - 1);

        if (totalWithSpaces <= maxWidth) {
            wrappedLines.push(words.join(spaceChar));
            continue;
        }

        // Minimum raggedness dynamic programming
        const n = words.length;

        function lineCost(i, j) {
            let width = -1;
            for (let k = i; k <= j; k++) {
                width += words[k].length + 1;
            }
            if (width > maxWidth) return Infinity;
            return Math.pow(maxWidth - width, 2);
        }

        const dp = new Array(n + 1).fill(Infinity);
        const breaks = new Array(n + 1).fill(0);
        dp[0] = 0;

        for (let j = 1; j <= n; j++) {
            for (let i = j; i >= 1; i--) {
                const cost = lineCost(i - 1, j - 1);
                if (cost === Infinity) break;
                if (dp[i - 1] + cost < dp[j]) {
                    dp[j] = dp[i - 1] + cost;
                    breaks[j] = i - 1;
                }
            }
        }

        // Reconstruct lines from break points
        const result = [];
        let idx = n;
        while (idx > 0) {
            const start = breaks[idx];
            result.unshift(words.slice(start, idx).join(spaceChar));
            idx = start;
        }
        wrappedLines.push(...result);
    }

    return wrappedLines.join('\n');
}

/**
 * Applies top and bottom spacing (newlines) to the text
 * @param {string} text - Input text
 * @param {Object} elements - DOM elements object
 * @returns {string} Text with spacing applied
 */
function applySpacing(text, elements) {
    // Get spacing value from elements (default to 0)
    const spacing = elements.outputSpacing ? parseInt(elements.outputSpacing.value) || 0 : 0;

    if (spacing === 0) {
        return text;
    }

    // Add invisible Unicode character (Hangul Filler) for spacing
    const invisibleSpace = 'ᅠ';

    // Add top spacing
    let spacedText = text;
    for (let i = 0; i < spacing; i++) {
        spacedText = invisibleSpace + '\n' + spacedText;
    }

    // Add bottom spacing
    for (let i = 0; i < spacing; i++) {
        spacedText = spacedText + '\n' + invisibleSpace;
    }

    return spacedText;
}