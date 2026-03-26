/**
 * Text Transformation Functions
 * Contains all functions that manipulate and transform text
 */

/**
 * Applies bold/italic formatting (asterisk-based and single-underscore italic).
 * Called standalone for remaining text, and also for inner content of
 * underline/strikethrough wrappers before combining characters are applied.
 * @param {string} text - Input text
 * @param {string} uppercaseStyle - Selected uppercase word style
 * @returns {string} Text with bold/italic styles applied
 */
function applyBoldItalic(text, uppercaseStyle) {
    // ***bold italic*** — must come before ** and *
    text = text.replace(/\*\*\*(.+?)\*\*\*/g, (match, word) => {
        return [...word].map(char => BOLD_ITALIC_FONTS[char] || char).join('');
    });

    // **bold**
    text = text.replace(/\*\*(.+?)\*\*/g, (match, word) => {
        if (!uppercaseStyle || !UPPERCASE_WORD_STYLES[uppercaseStyle]) return word;
        return UPPERCASE_WORD_STYLES[uppercaseStyle].transform(word);
    });

    // *italic*
    text = text.replace(/\*(.+?)\*/g, (match, word) => {
        return [...word].map(char => ITALIC_FONTS[char] || char).join('');
    });

    // _italic_ (single underscore — must not match inside __ pairs, which are
    // already consumed before this function is called)
    text = text.replace(/_(.+?)_/g, (match, word) => {
        return [...word].map(char => ITALIC_FONTS[char] || char).join('');
    });

    return text;
}

/**
 * Applies Discord-style markdown inline formatting:
 *   ~~text~~          → strikethrough (U+0336 combining long stroke overlay)
 *   __text__          → underline (U+0332 combining low line)
 *   __*text*__        → underline + italic
 *   __**text**__      → underline + bold
 *   __***text***__    → underline + bold italic
 *   ***text***        → bold italic
 *   **text**          → bold (uses selected uppercase word style)
 *   *text* or _text_  → italic
 *
 * Underline and strikethrough process inner formatting first, then apply
 * combining characters so that inner markers are not broken.
 * @param {string} text - Input text
 * @param {string} uppercaseStyle - Selected uppercase word style
 * @returns {string} Text with styled words
 */
function applyMarkdownStyles(text, uppercaseStyle) {
    // 1. ~~strikethrough~~ — apply inner bold/italic first, then combine
    text = text.replace(/~~(.+?)~~/g, (match, content) => {
        content = applyBoldItalic(content, uppercaseStyle);
        return [...content].map(char => char + '\u0336').join('');
    });

    // 2. __underline__ — apply inner bold/italic first, then combine
    text = text.replace(/__(.+?)__/g, (match, content) => {
        content = applyBoldItalic(content, uppercaseStyle);
        return [...content].map(char => char + '\u0332').join('');
    });

    // 3. Remaining bold/italic not inside underline/strikethrough
    text = applyBoldItalic(text, uppercaseStyle);

    return text;
}

/**
 * Replaces the first letter with a styled version based on selected font
 * @param {string} text - Input text
 * @param {string} fontStyle - Selected font style
 * @returns {string} Text with styled first letter
 */
function replaceFirstLetter(text, fontStyle, originalText) {
    if (!fontStyle) return text;

    const lines = text.split('\n');
    const originalLines = originalText ? originalText.split('\n') : lines;
    return lines.map((line, i) => {
        if (!line) return line;
        // Only style paragraph starts: first line, or lines after a blank line
        const isParagraphStart = i === 0 || lines[i - 1] === '';
        if (!isParagraphStart) return line;
        // Use the original text's first letter for lookup, since the current
        // first character may already be a styled Unicode character
        const originalFirstLetter = (originalLines[i] || line).charAt(0);
        const replacementLetter = FIRST_LETTER_FONTS[fontStyle]?.[originalFirstLetter];
        if (!replacementLetter) return line;
        // Replace the first character (which may be a multi-byte styled char)
        const firstChar = [...line][0];
        return replacementLetter + line.slice(firstChar.length);
    }).join('\n');
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
 * Replaces exclamation marks with selected style
 * @param {string} text - Input text
 * @param {string} exclamationStyle - Selected exclamation style
 * @returns {string} Text with replaced exclamation marks
 */
function replaceExclamations(text, exclamationStyle) {
    if (!exclamationStyle) return text;
    return text.replace(/!/g, exclamationStyle);
}

/**
 * Replaces question marks with selected style
 * @param {string} text - Input text
 * @param {string} questionStyle - Selected question mark style
 * @returns {string} Text with replaced question marks
 */
function replaceQuestions(text, questionStyle) {
    if (!questionStyle) return text;
    return text.replace(/\?/g, questionStyle);
}

/**
 * Replaces quotation marks with selected style
 * Value format: "open,close" — replaces both single and double quotes
 * @param {string} text - Input text
 * @param {string} quoteStyle - Selected quote style
 * @returns {string} Text with replaced quotation marks
 */
function replaceQuotes(text, quoteStyle) {
    if (!quoteStyle) return text;

    const [open, close] = quoteStyle.split(',');

    // Replace double quotes (both straight and curly)
    text = text.replace(/\u201C(.*?)\u201D/g, `${open}$1${close}`);
    text = text.replace(/"(.*?)"/g, `${open}$1${close}`);

    return text;
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

    try {
        const originalText = processedText;

        // Apply text transformations in the correct order
        processedText = applyMarkdownStyles(
            processedText,
            elements.uppercaseWordStyle.value
        );
        processedText = replaceUppercaseWords(
            processedText,
            elements.uppercaseWordStyle.value
        );
        processedText = replaceCommas(
            processedText,
            elements.commaStyle.value
        );
        processedText = replaceExclamations(
            processedText,
            elements.exclamationStyle.value
        );
        processedText = replaceQuestions(
            processedText,
            elements.questionStyle.value
        );
        processedText = replaceQuotes(
            processedText,
            elements.quoteStyle.value
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

        // Apply first letter styling after alignment, paragraph starts only
        // Pass original text so the lookup uses ASCII letters even if they've been styled
        processedText = replaceFirstLetter(
            processedText,
            elements.firstLetterFont.value,
            originalText
        );

        // Apply spacing settings (newlines before and after)
        processedText = applySpacing(processedText, elements);

        elements.output.innerHTML = processedText;
    } catch (error) {
        console.error('Error processing text transformations:', error);
        // Fall back to showing the raw input so the user isn't left with a blank output
        elements.output.textContent = elements.inputText.value;
    }
}

/**
 * Returns the visible length of a word, excluding formatting markers (*** ** * __ ~~ _)
 */
function visibleLength(word) {
    return [...word.replace(/\*\*\*|\*\*|~~|__|[*_]/g, '')].length;
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

    const maxWidth = elements.alignmentWidth ? parseInt(elements.alignmentWidth.value) || 35 : 35;
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

        const totalChars = words.reduce((sum, w) => sum + visibleLength(w), 0);
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
                width += visibleLength(words[k]) + 1;
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