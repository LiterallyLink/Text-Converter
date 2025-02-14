document.addEventListener('DOMContentLoaded', () => {
    // First letter font mappings with support for both lowercase and uppercase
    const FIRST_LETTER_FONTS = {
        'cursive': {
            'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 
            'f': '𝓯', 'g': '𝓰', 'h': '𝓱', 'i': '𝓲', 'j': '𝓳', 
            'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 
            'p': '𝓹', 'q': '𝓺', 'r': '𝓻', 's': '𝓼', 't': '𝓽', 
            'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁', 'y': '𝔂', 'z': '𝔃',
            'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 
            'F': '𝓕', 'G': '𝓖', 'H': '𝓗', 'I': '𝓘', 'J': '𝓙', 
            'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 
            'P': '𝓟', 'Q': '𝓠', 'R': '𝓡', 'S': '𝓢', 'T': '𝓣', 
            'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧', 'Y': '𝓨', 'Z': '𝓩'
        },
        'gothic': {
            'a': '𝖆', 'b': '𝖇', 'c': '𝖈', 'd': '𝖉', 'e': '𝖊', 
            'f': '𝖋', 'g': '𝖌', 'h': '𝖍', 'i': '𝖎', 'j': '𝖏', 
            'k': '𝖐', 'l': '𝖑', 'm': '𝖒', 'n': '𝖓', 'o': '𝖔', 
            'p': '𝖕', 'q': '𝖖', 'r': '𝖗', 's': '𝖘', 't': '𝖙', 
            'u': '𝖚', 'v': '𝖛', 'w': '𝖜', 'x': '𝖝', 'y': '𝖞', 'z': '𝖟',
            'A': '𝕬', 'B': '𝕭', 'C': '𝕮', 'D': '𝕯', 'E': '𝕰', 
            'F': '𝕱', 'G': '𝕲', 'H': '𝕳', 'I': '𝕴', 'J': '𝕵', 
            'K': '𝕶', 'L': '𝕷', 'M': '𝕸', 'N': '𝕹', 'O': '𝕺', 
            'P': '𝕻', 'Q': '𝕼', 'R': '𝕽', 'S': '𝕾', 'T': '𝕿', 
            'U': '𝖀', 'V': '𝖁', 'W': '𝖂', 'X': '𝖃', 'Y': '𝖄', 'Z': '𝖅'
        },
        'bold': {
            'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 
            'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 
            'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 
            'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 
            'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
            'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 
            'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 
            'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 
            'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 
            'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭'
        }
    };

    // New added for UPPERCASE word styling
    const UPPERCASE_WORD_STYLES = {
        'bold': {
            transform: (word) => word.split('').map(char => FIRST_LETTER_FONTS['bold'][char] || char).join('')
        },
        'serif-bold': {
            transform: (word) => `<span style="font-weight: bold; font-family: serif;">${word}</span>`
        },
        'serif-bold-italic': {
            transform: (word) => `<span style="font-weight: bold; font-style: italic; font-family: serif;">${word}</span>`
        },
        'bold-italic': {
            transform: (word) => `<span style="font-weight: bold; font-style: italic;">${word}</span>`
        }
    };

    const SPACE_STYLES = {
        'thin-space': '\u2009',     // Thin space
        'hair-space': '\u200A',     // Hair space
        'figure-space': '\u2007',   // Figure space
        'punctuation-space': '\u2008', // Punctuation space
        'em-quad': '\u2001',        // Em quad space
        'en-quad': '\u2000'         // En quad space
    };

    // DOM Elements
    const elements = {
        inputText: document.getElementById('inputText'),
        firstLetterFont: document.getElementById('firstLetterFont'),
        commaStyle: document.getElementById('commaStyle'),
        punctuationStyle: document.getElementById('punctuationStyle'),
        spaceStyle: document.getElementById('spaceStyle'),
        uppercaseWordStyle: document.getElementById('uppercaseWordStyle'), // New dropdown for uppercase word styling
        output: document.getElementById('output')
    };

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
            // Check if word is completely uppercase and not empty
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

        // Split the style into two options
        const [exclamationStyle, questionStyle] = punctuationStyle.split(',');

        // Replace punctuation with specific styles
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
     * Updates the output with processed text
     */
    function updateOutput() {
        const inputText = elements.inputText.value;
        if (!inputText) {
            elements.output.innerHTML = '';
            return;
        }

        let processedText = inputText;
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
        processedText = replaceSpaces(
            processedText,
            elements.spaceStyle.value
        );

        elements.output.innerHTML = processedText;
    }

    // Add event listeners
    elements.inputText.addEventListener('input', updateOutput);
    elements.firstLetterFont.addEventListener('change', updateOutput);
    elements.uppercaseWordStyle.addEventListener('change', updateOutput);
    elements.commaStyle.addEventListener('change', updateOutput);
    elements.punctuationStyle.addEventListener('change', updateOutput);
    elements.spaceStyle.addEventListener('change', updateOutput);
});