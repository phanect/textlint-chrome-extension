// This is auto-generated file by `gulp bundle`
"use strict";

export default {
  get: function (name) {
    return this.bundles[name];
  },
  load: function (name, cb) {
    this.loaders[name].call(null, cb);
  },
  loaders: {

    "textlint-rule-alex": (cb) => { require(["textlint-rule-alex"], cb) },

    "textlint-rule-general-novel-style-ja": (cb) => { require(["textlint-rule-general-novel-style-ja"], cb) },

    "textlint-rule-max-ten": (cb) => { require(["textlint-rule-max-ten"], cb) },

    "textlint-rule-no-double-negative-ja": (cb) => { require(["textlint-rule-no-double-negative-ja"], cb) },

    "textlint-rule-no-doubled-joshi": (cb) => { require(["textlint-rule-no-doubled-joshi"], cb) },

    "textlint-rule-no-mix-dearu-desumasu": (cb) => { require(["textlint-rule-no-mix-dearu-desumasu"], cb) },

    "textlint-rule-no-start-duplicated-conjunction": (cb) => { require(["textlint-rule-no-start-duplicated-conjunction"], cb) },

    "textlint-rule-rousseau": (cb) => { require(["textlint-rule-rousseau"], cb) },

    "textlint-rule-sentence-length": (cb) => { require(["textlint-rule-sentence-length"], cb) },

    "textlint-rule-spellcheck-tech-word": (cb) => { require(["textlint-rule-spellcheck-tech-word"], cb) },

  },
  bundles: {

    "textlint-rule-alex":
      {
        "name": "textlint-rule-alex",
        "key": "alex",
        "version": "1.0.1",
        "description": "textlint rule for alex",
        "author": "azu",
        "license": "MIT",
        "homepage": "https://github.com/azu/textlint-rule-alex",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "allow": {
                  "title": "Ignoring type of message",
                  "type": "array",
                  "items": {
                    "title": "Type of message",
                    "type": "string",
                    "minLength": 1
                  },
                  "uniqueItems": true
                }
              }
            }
          ]
        }
      },

    "textlint-rule-general-novel-style-ja":
      {
        "name": "textlint-rule-general-novel-style-ja",
        "key": "general-novel-style-ja",
        "version": "1.2.0",
        "description": "textlint rule to follow general style of Japanese novels",
        "author": "IRIDE Monad",
        "license": "MIT",
        "homepage": "https://github.com/io-monad/textlint-rule-general-novel-style-ja",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "chars_leading_paragraph": {
                  "title": "Characters allowed to lead a paragraph",
                  "oneOf": [
                    {
                      "title": "Characters",
                      "type": "string",
                      "minLength": 1
                    },
                    {
                      "title": "Disable checking",
                      "type": "boolean",
                      "enum": [
                        false
                      ]
                    }
                  ],
                  "default": "　「『【〈《（(“\"‘'［[〔｛{＜<"
                },
                "no_punctuation_at_closing_quote": {
                  "title": "Disallow to put punctuations before closing quote",
                  "type": "boolean",
                  "default": true
                },
                "space_after_marks": {
                  "title": "Require a space after exclamation and question marks",
                  "type": "boolean",
                  "default": true
                },
                "even_number_ellipsises": {
                  "title": "Require even number of ellipsises",
                  "type": "boolean",
                  "default": true
                },
                "even_number_dashes": {
                  "title": "Require even number of dashes",
                  "type": "boolean",
                  "default": true
                },
                "appropriate_use_of_punctuation": {
                  "title": "Disallow consecutive punctuations",
                  "type": "boolean",
                  "default": true
                },
                "appropriate_use_of_interpunct": {
                  "title": "Disallow consecutive interpuncts",
                  "type": "boolean",
                  "default": true
                },
                "appropriate_use_of_choonpu": {
                  "title": "Disallow consecutive cho-onpu",
                  "type": "boolean",
                  "default": true
                },
                "appropriate_use_of_minus_sign": {
                  "title": "Require number after minus sign",
                  "type": "boolean",
                  "default": true
                },
                "max_arabic_numeral_digits": {
                  "title": "Maximum digits of Arabic numerals",
                  "oneOf": [
                    {
                      "title": "Max number",
                      "type": "integer",
                      "minimum": 1
                    },
                    {
                      "title": "Disable checking",
                      "type": "boolean",
                      "enum": [
                        false
                      ]
                    }
                  ],
                  "default": 2
                }
              }
            }
          ]
        }
      },

    "textlint-rule-max-ten":
      {
        "name": "textlint-rule-max-ten",
        "key": "max-ten",
        "version": "2.0.1",
        "description": "textlint rule that limit maxinum ten(、) count of sentence.",
        "author": "azu",
        "license": "MIT",
        "homepage": "https://github.com/azu/textlint-rule-max-ten",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "max": {
                  "title": "Maximum number of \"、\" allowed in a sentence",
                  "type": "integer",
                  "minimum": 1,
                  "default": 3
                },
                "strict": {
                  "title": "Strict check",
                  "type": "boolean",
                  "default": false
                }
              }
            }
          ]
        }
      },

    "textlint-rule-no-double-negative-ja":
      {
        "name": "textlint-rule-no-double-negative-ja",
        "key": "no-double-negative-ja",
        "version": "1.0.3",
        "description": "二重否定をチェックするtextlint rule",
        "author": "azu",
        "license": "MIT",
        "homepage": "https://github.com/azu/textlint-rule-no-double-negative-ja",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "Enable this rule",
          "type": "boolean"
        }
      },

    "textlint-rule-no-doubled-joshi":
      {
        "name": "textlint-rule-no-doubled-joshi",
        "key": "no-doubled-joshi",
        "version": "3.2.0",
        "description": "textlint rule check doubled joshi",
        "author": "azu",
        "license": "MIT",
        "homepage": "https://github.com/azu/textlint-rule-no-doubled-joshi",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "min_interval": {
                  "title": "Minimum interval of joshi",
                  "type": "integer",
                  "minimum": 1,
                  "default": 1
                },
                "strict": {
                  "title": "Strict check",
                  "type": "boolean",
                  "default": false
                }
              }
            }
          ]
        }
      },

    "textlint-rule-no-mix-dearu-desumasu":
      {
        "name": "textlint-rule-no-mix-dearu-desumasu",
        "key": "no-mix-dearu-desumasu",
        "version": "1.4.0",
        "description": "textlint rule that no mix である and ですます.",
        "author": "azu",
        "license": "MIT",
        "homepage": "https://github.com/azu/textlint-rule-no-mix-dearu-desumasu",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "Enable this rule",
          "type": "boolean"
        }
      },

    "textlint-rule-no-start-duplicated-conjunction":
      {
        "name": "textlint-rule-no-start-duplicated-conjunction",
        "key": "no-start-duplicated-conjunction",
        "version": "1.0.7",
        "description": "textlint rule that check no start with duplicated conjunction.",
        "author": "azu",
        "license": "MIT",
        "homepage": "https://github.com/azu/textlint-rule-no-start-duplicated-conjunction",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "interval": {
                  "title": "Interval of sentences",
                  "type": "integer",
                  "minimum": 1,
                  "default": 2
                }
              }
            }
          ]
        }
      },

    "textlint-rule-rousseau":
      {
        "name": "textlint-rule-rousseau",
        "key": "rousseau",
        "version": "1.3.2",
        "description": "textlint rule check english sentence using rousseau",
        "author": "azu",
        "license": "MIT",
        "homepage": "https://github.com/azu/textlint-rule-rousseau",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "showLevels": {
                  "title": "Level of importance",
                  "type": "array",
                  "items": {
                    "title": "Level",
                    "type": "string",
                    "enum": [
                      "suggestion",
                      "warning",
                      "error"
                    ]
                  },
                  "uniqueItems": true
                },
                "ignoreTypes": {
                  "title": "Ignoring type of check",
                  "type": "array",
                  "items": {
                    "title": "Type of message",
                    "type": "string",
                    "enum": [
                      "passive",
                      "lexical-illusion",
                      "so",
                      "adverbs",
                      "readibility",
                      "simplicity",
                      "weasel",
                      "sentence:start",
                      "sentence:end",
                      "sentence:uppercase"
                    ]
                  },
                  "uniqueItems": true
                }
              }
            }
          ]
        }
      },

    "textlint-rule-sentence-length":
      {
        "name": "textlint-rule-sentence-length",
        "key": "sentence-length",
        "version": "1.0.4",
        "description": "textlint rule check sentence length",
        "author": "azu",
        "license": "MIT",
        "homepage": "https://github.com/azu/textlint-rule-sentence-length",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "max": {
                  "title": "Maximum length of a sentence",
                  "type": "integer",
                  "minimum": 1,
                  "default": 100
                }
              }
            }
          ]
        }
      },

    "textlint-rule-spellcheck-tech-word":
      {
        "name": "textlint-rule-spellcheck-tech-word",
        "key": "spellcheck-tech-word",
        "version": "4.2.0",
        "description": "textlint rule: spell check technical word for japanese.",
        "author": "azu",
        "license": "MIT",
        "homepage": "https://github.com/azu/textlint-rule-spellcheck-tech-word/",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "Enable this rule",
          "type": "boolean"
        }
      },

  }
}
