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
 * Wraps text to a max character width, breaking at word boundaries
 * @param {string} text - Input text
 * @param {Object} elements - DOM elements object
 * @returns {string} Text with line breaks inserted
 */
function applyTextAlignment(text, elements) {
    const enabled = elements.textAlignment ? elements.textAlignment.value === 'true' : false;
    if (!enabled) return text;

    const maxWidth = 35; // Twitter-optimized line width
    const lines = text.split('\n');
    const wrappedLines = [];

    for (const line of lines) {
        if (line.length <= maxWidth) {
            wrappedLines.push(line);
            continue;
        }

        const words = line.split(/ +/);
        let currentLine = '';

        for (const word of words) {
            if (currentLine === '') {
                currentLine = word;
            } else if ((currentLine + ' ' + word).length <= maxWidth) {
                currentLine += ' ' + word;
            } else {
                wrappedLines.push(currentLine);
                currentLine = word;
            }
        }

        if (currentLine) {
            wrappedLines.push(currentLine);
        }
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