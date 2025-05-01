/**
 * Font Mappings and Symbol Collections
 * Contains all character mapping objects and symbol arrays used for text transformations
 */

// First Letter Font Mappings
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

// Serif Bold Font Mapping
const SERIF_BOLD_FONTS = {
    'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 
    'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 
    'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 
    'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 
    'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
    'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 
    'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 
    'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 
    'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 
    'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳'
};

// Serif Bold Italic Font Mapping
const SERIF_BOLD_ITALIC_FONTS = {
    'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 
    'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 
    'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 
    'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 
    'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
    'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 
    'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 
    'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 
    'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 
    'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛'
};

// Bold Italic Font Mapping
const BOLD_ITALIC_FONTS = {
    'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 
    'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 
    'K': '𝙆', 'L': '𝙇', 'M': '𝙈', 'N': '𝙉', 'O': '𝙊', 
    'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 
    'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
    'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 
    'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 
    'k': '𝙠', 'l': '𝙡', 'm': '𝙢', 'n': '𝙣', 'o': '𝙤', 
    'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 
    'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
};

// Italic Font Mapping
const ITALIC_FONTS = {
    'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 
    'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑', 
    'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 
    'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛', 
    'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡',
    'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 
    'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫', 
    'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 
    'p': '𝘱', 'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 
    'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻'
};

// Cryptic Italic Font Mapping
const CRYPTIC_ITALIC_FONTS = {
    'A': '𐌀', 'B': '𐌁', 'C': '𐌂', 'D': '𐌃', 'E': '𐌄', 'F': '𐌅',
    'G': 'Ᏽ', 'H': '𐋅', 'I': '𐌉', 'J': 'Ꮭ', 'K': '𐌊', 'L': '𐌋',
    'M': '𐌌', 'N': '𐌍', 'O': 'Ꝋ', 'P': '𐌐', 'Q': '𐌒', 'R': '𐌓',
    'S': '𐌔', 'T': '𐌕', 'U': '𐌵', 'V': 'ᕓ', 'W': 'Ᏸ', 'X': '𐋄',
    'Y': '𐌙', 'Z': 'Ɀ'
};

// Uppercase Word Style Transformations
const UPPERCASE_WORD_STYLES = {
    'bold': {
        transform: (word) => word.split('').map(char => FIRST_LETTER_FONTS['bold'][char] || char).join('')
    },
    'gothic': {
        transform: (word) => word.split('').map(char => FIRST_LETTER_FONTS['gothic'][char] || char).join('')
    },
    'serif-bold': {
        transform: (word) => word.split('').map(char => SERIF_BOLD_FONTS[char] || char).join('')
    },
    'serif-bold-italic': {
        transform: (word) => word.split('').map(char => SERIF_BOLD_ITALIC_FONTS[char] || char).join('')
    },
    'bold-italic': {
        transform: (word) => word.split('').map(char => BOLD_ITALIC_FONTS[char] || char).join('')
    },
    'italic': {
        transform: (word) => word.split('').map(char => ITALIC_FONTS[char] || char).join('')
    },
    'cryptic-italic': {
        transform: (word) => word.split('').map(char => CRYPTIC_ITALIC_FONTS[char] || char).join('')
    }
};

// Space Style Replacements
const SPACE_STYLES = {
    'thin-space': '\u2009',     // Thin space
    'hair-space': '\u200A',     // Hair space
    'figure-space': '\u2007',   // Figure space
    'punctuation-space': '\u2008', // Punctuation space
    'em-quad': '\u2001',        // Em quad space
    'en-quad': '\u2000'         // En quad space
};

// Random Symbol Collection
const RANDOM_SYMBOLS = [
    "˚", "𐙚","𓏲", "ִֶָ𓂃", "ᡣ", "𐭩", "۶", "ৎ",
    "࿔", "𝜗", "࣪˖", "་༘࿐", "𓆰𓆪", "𓍢ִ໋", "͙֒ ", "࣪ ˖",
    "˙⊹",  "⸝⸝ ۫", "︵", "﹏",  "፧", "‹ ‹ ˊ","❜ ፧",
    "ゞ", "𐔌⩩", "〲", "𓂃", "─┄", "┈", "✱", "♯",
    "⌇", "◟ ݁", "✦‍    *", "冫", " ٫̷ ", "彡", "᭧",
    "..̲ ̲", "៹", " ̼", ".͟.", "ᝰ", " ⭇ ", "  ݁ ", "𓂅",
    "❜", "‿", "𒂟", "⊰", "ノ", "˖∿", "༯", "╭", "'",
    "˒", "◜", "⠀❚⠀", "⧽", "៸", "᭤", "°﹒", "' •", "⧼ "
];