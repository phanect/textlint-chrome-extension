"use strict";

// RegExp to pick a word at caret in textarea.
//  Since "\b" only represents boundary of English words,
//  Japanese sentences would always be treated as one word.
//  To avoid this, we want to match Japanese words first.
let wordRegexp = new RegExp([
  '[\\u3040-\\u309F]{1,10}',   // Hiragana
  '[\\u30A0-\\u30FF]{1,10}',   // Katakana
  '[\\uFF65-\\uFF9F]{1,10}',   // Half-width Katakana
  '[\\uFF01-\\uFF60]{1,10}',   // Full-width ASCII
  '(?:' +                      // Kanji
    '[々〇〻\\u3400-\\u9FFF\\uF900-\\uFAFF]' +
    '|[\\uD840-\\uD87F][\\uDC00-\\uDFFF]' +
  '){1,10}',
  '\\w{1,20}',                 // English word
  '.{1,20}?(?:\\b|$)'          // Any characters to word boundary
].join('|'), 'gm');

// Utility class to get a word at caret in textarea.
// It can convert (line, column) coordinates into index of string.
export default class TextCaretScanner {
  constructor(text) {
    this.text = text;
    this.lineToIndex = this._buildLineToIndex(text);
  }

  // Build {line: index} hash
  _buildLineToIndex(text) {
    const lines = text.split(/\n/);
    let index = 0;
    let lineToIndex = new Array(lines.length);
    for (let i = 0, l = lines.length; i < l; i++) {
      lineToIndex[i] = index;
      index += lines[i].length + 1;  // 1 = "\n".length
    }
    return lineToIndex;
  }

  getWordAtIndex(index) {
    wordRegexp.lastIndex = index;
    let match = wordRegexp.exec(this.text);
    return match ? match[0] : "";
  }

  getIndexFromLineColumn(line, column) {
    line--;    // to 0-origin
    column--;  // to 0-origin

    if (line < this.lineToIndex.length) {
      return this.lineToIndex[line] + column;
    } else {
      return -1;
    }
  }

  getWordRangeFromLineColumn(line, column) {
    let index = this.getIndexFromLineColumn(line, column);
    if (index >= 0) {
      let word = this.getWordAtIndex(index) || "?";  // Minimum +1 range
      return [index, index + word.length];
    } else {
      return [0, 1];
    }
  }

  getWordFromLineColumn(line, column) {
    let range = this.getWordRangeFromLineColumn(line, column);
    return this.text.slice(range[0], range[1]);
  }
}
