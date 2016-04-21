/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
// This is auto-generated file by `gulp bundle`
"use strict";

/* eslint-disable */
export default {
  get(name) {
    name = "textlint-rule-" + name.replace(/^textlint-rule-/, "");
    return this.bundles[name];
  },
  load(name, cb) {
    name = "textlint-rule-" + name.replace(/^textlint-rule-/, "");
    this.loaders[name].call(null, cb);
  },

  loaders: {

    "textlint-rule-alex": (cb) => { require(["textlint-rule-alex"], cb) },

    "textlint-rule-common-misspellings": (cb) => { require(["textlint-rule-common-misspellings"], cb) },

    "textlint-rule-general-novel-style-ja": (cb) => { require(["textlint-rule-general-novel-style-ja"], cb) },

    "textlint-rule-incremental-headers": (cb) => { require(["textlint-rule-incremental-headers"], cb) },

    "textlint-rule-max-appearence-count-of-words": (cb) => { require(["textlint-rule-max-appearence-count-of-words"], cb) },

    "textlint-rule-max-length-of-title": (cb) => { require(["textlint-rule-max-length-of-title"], cb) },

    "textlint-rule-max-number-of-lines": (cb) => { require(["textlint-rule-max-number-of-lines"], cb) },

    "textlint-rule-max-ten": (cb) => { require(["textlint-rule-max-ten"], cb) },

    "textlint-rule-ng-word": (cb) => { require(["textlint-rule-ng-word"], cb) },

    "textlint-rule-no-double-negative-ja": (cb) => { require(["textlint-rule-no-double-negative-ja"], cb) },

    "textlint-rule-no-doubled-conjunctive-particle-ga": (cb) => { require(["textlint-rule-no-doubled-conjunctive-particle-ga"], cb) },

    "textlint-rule-no-doubled-joshi": (cb) => { require(["textlint-rule-no-doubled-joshi"], cb) },

    "textlint-rule-no-dropping-the-ra": (cb) => { require(["textlint-rule-no-dropping-the-ra"], cb) },

    "textlint-rule-no-mix-dearu-desumasu": (cb) => { require(["textlint-rule-no-mix-dearu-desumasu"], cb) },

    "textlint-rule-no-start-duplicated-conjunction": (cb) => { require(["textlint-rule-no-start-duplicated-conjunction"], cb) },

    "textlint-rule-preset-jtf-style": (cb) => { require(["textlint-rule-preset-jtf-style"], cb) },

    "textlint-rule-rousseau": (cb) => { require(["textlint-rule-rousseau"], cb) },

    "textlint-rule-sentence-length": (cb) => { require(["textlint-rule-sentence-length"], cb) },

    "textlint-rule-sjsj": (cb) => { require(["textlint-rule-sjsj"], cb) },

    "textlint-rule-spellcheck-tech-word": (cb) => { require(["textlint-rule-spellcheck-tech-word"], cb) },

    "textlint-rule-unexpanded-acronym": (cb) => { require(["textlint-rule-unexpanded-acronym"], cb) },

  },

  textlint:
    {
      "name": "textlint",
      "key": "textlint",
      "version": "6.3.0",
      "description": "The pluggable linting tool for text and markdown.",
      "author": "azu",
      "license": "MIT",
      "homepage": "https://github.com/textlint/textlint/",
      "isPreset": false,
      "rules": [],
      "schema": null
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
          "title": "textlint-rule-alex configuration",
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
                },
                "severity": {
                  "title": "Severity of lint messages",
                  "type": "string",
                  "enum": [
                    "error",
                    "warning",
                    "info"
                  ],
                  "default": "error"
                }
              }
            }
          ]
        }
      },

    "textlint-rule-common-misspellings":
      {
        "name": "textlint-rule-common-misspellings",
        "key": "common-misspellings",
        "version": "1.0.1",
        "description": "textlint rule to check common misspellings",
        "author": "IRIDE Monad",
        "license": "GPL-3.0",
        "homepage": "https://github.com/io-monad/textlint-rule-common-misspellings",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "textlint-rule-common-misspellings configuration",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "ignore": {
                  "title": "Ignoring misspellings",
                  "type": "array",
                  "items": {
                    "title": "Misspelling",
                    "type": "string",
                    "minLength": 1
                  },
                  "uniqueItems": true
                },
                "severity": {
                  "title": "Severity of lint messages",
                  "type": "string",
                  "enum": [
                    "error",
                    "warning",
                    "info"
                  ],
                  "default": "error"
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
        "version": "1.3.0",
        "description": "textlint rule to follow general style of Japanese novels",
        "author": "IRIDE Monad",
        "license": "MIT",
        "homepage": "https://github.com/io-monad/textlint-rule-general-novel-style-ja",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "textlint-rule-general-novel-style-ja configuration",
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
                },
                "severity": {
                  "title": "Severity of lint messages",
                  "type": "string",
                  "enum": [
                    "error",
                    "warning",
                    "info"
                  ],
                  "default": "error"
                }
              }
            }
          ]
        }
      },

    "textlint-rule-incremental-headers":
      {
        "name": "textlint-rule-incremental-headers",
        "key": "incremental-headers",
        "version": "0.2.0",
        "description": "見出しの深さが１つずつ増えているかどうかを確認するtextlintプラグイン",
        "author": "matsu_chara",
        "license": "MIT",
        "homepage": "https://github.com/matsu-chara/textlint-rule-incremental-headers#readme",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "textlint-rule-incremental-headers configuration",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "severity": {
                  "title": "Severity of lint messages",
                  "type": "string",
                  "enum": [
                    "error",
                    "warning",
                    "info"
                  ],
                  "default": "error"
                }
              }
            }
          ]
        }
      },

    "textlint-rule-max-appearence-count-of-words":
      {
        "name": "textlint-rule-max-appearence-count-of-words",
        "key": "max-appearence-count-of-words",
        "version": "1.0.1",
        "description": "textlint rule that check maximum appearance count of words in paragraph",
        "author": "Keita Moromizato",
        "license": "MIT",
        "homepage": "https://github.com/KeitaMoromizato/textlint-rule-max-appearence-count-of-words#readme",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "textlint-rule-max-appearence-count-of-words configuration",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "limit": {
                  "title": "Maximum apprearance count of words",
                  "type": "integer",
                  "minimum": 1,
                  "default": 4
                },
                "severity": {
                  "title": "Severity of lint messages",
                  "type": "string",
                  "enum": [
                    "error",
                    "warning",
                    "info"
                  ],
                  "default": "error"
                }
              }
            }
          ]
        }
      },

    "textlint-rule-max-length-of-title":
      {
        "name": "textlint-rule-max-length-of-title",
        "key": "max-length-of-title",
        "version": "1.0.1",
        "description": "textlint rule that check limit maximum length of title",
        "author": "Keita Moromizato",
        "license": "MIT",
        "homepage": "https://github.com/KeitaMoromizato/textlint-rule-max-length-of-title#readme",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "textlint-rule-max-length-of-title configuration",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "#": {
                  "title": "Maximum length of h1 title",
                  "type": "integer",
                  "default": 32
                },
                "##": {
                  "title": "Maximum length of h2 title",
                  "type": "integer"
                },
                "###": {
                  "title": "Maximum length of h3 title",
                  "type": "integer"
                },
                "####": {
                  "title": "Maximum length of h4 title",
                  "type": "integer"
                },
                "#####": {
                  "title": "Maximum length of h5 title",
                  "type": "integer"
                },
                "######": {
                  "title": "Maximum length of h6 title",
                  "type": "integer"
                },
                "severity": {
                  "title": "Severity of lint messages",
                  "type": "string",
                  "enum": [
                    "error",
                    "warning",
                    "info"
                  ],
                  "default": "error"
                }
              }
            }
          ]
        }
      },

    "textlint-rule-max-number-of-lines":
      {
        "name": "textlint-rule-max-number-of-lines",
        "key": "max-number-of-lines",
        "version": "1.0.2",
        "description": "textlint rule for linting number of lines.",
        "author": "azu",
        "license": "MIT",
        "homepage": "https://github.com/azu/textlint-rule-max-number-of-lines",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "textlint-rule-max-number-of-lines configuration",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "max": {
                  "title": "Maximum number of lines",
                  "type": "integer",
                  "minimum": 1,
                  "default": 300
                },
                "severity": {
                  "title": "Severity of lint messages",
                  "type": "string",
                  "enum": [
                    "error",
                    "warning",
                    "info"
                  ],
                  "default": "error"
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
          "title": "textlint-rule-max-ten configuration",
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
                },
                "severity": {
                  "title": "Severity of lint messages",
                  "type": "string",
                  "enum": [
                    "error",
                    "warning",
                    "info"
                  ],
                  "default": "error"
                }
              }
            }
          ]
        }
      },

    "textlint-rule-ng-word":
      {
        "name": "textlint-rule-ng-word",
        "key": "ng-word",
        "version": "1.0.0",
        "description": "textlint rule that check NG words",
        "author": "Keita Moromizato",
        "license": "MIT",
        "homepage": "https://github.com/KeitaMoromizato/textlint-rule-ng-word#readme",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "textlint-rule-ng-word configuration",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "words": {
                  "title": "NG words",
                  "type": "array",
                  "items": {
                    "title": "NG word",
                    "type": "string",
                    "minLength": 1
                  },
                  "uniqueItems": true
                },
                "severity": {
                  "title": "Severity of lint messages",
                  "type": "string",
                  "enum": [
                    "error",
                    "warning",
                    "info"
                  ],
                  "default": "error"
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
          "title": "textlint-rule-no-double-negative-ja configuration",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "severity": {
                  "title": "Severity of lint messages",
                  "type": "string",
                  "enum": [
                    "error",
                    "warning",
                    "info"
                  ],
                  "default": "error"
                }
              }
            }
          ]
        }
      },

    "textlint-rule-no-doubled-conjunctive-particle-ga":
      {
        "name": "textlint-rule-no-doubled-conjunctive-particle-ga",
        "key": "no-doubled-conjunctive-particle-ga",
        "version": "1.0.2",
        "description": "textlint rule plugin to check duplicated conjunctive particle `ga` in a sentence.",
        "author": "takahashim",
        "license": "MIT",
        "homepage": "https://github.com/takahashim/textlint-rule-no-doubled-conjunctive-particle-ga",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "textlint-rule-doubled-conjunctive-particle-ga configuration",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "severity": {
                  "title": "Severity of lint messages",
                  "type": "string",
                  "enum": [
                    "error",
                    "warning",
                    "info"
                  ],
                  "default": "error"
                }
              }
            }
          ]
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
          "title": "textlint-rule-no-doubled-joshi configuration",
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
                },
                "severity": {
                  "title": "Severity of lint messages",
                  "type": "string",
                  "enum": [
                    "error",
                    "warning",
                    "info"
                  ],
                  "default": "error"
                }
              }
            }
          ]
        }
      },

    "textlint-rule-no-dropping-the-ra":
      {
        "name": "textlint-rule-no-dropping-the-ra",
        "key": "no-dropping-the-ra",
        "version": "1.0.1",
        "description": "ら抜き言葉を検出するtextlint rule",
        "author": "azu",
        "license": "MIT",
        "homepage": "https://github.com/azu/textlint-rule-no-dropping-the-ra",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "textlint-rule-no-dropping-the-ra configuration",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "severity": {
                  "title": "Severity of lint messages",
                  "type": "string",
                  "enum": [
                    "error",
                    "warning",
                    "info"
                  ],
                  "default": "error"
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
          "title": "textlint-rule-no-mix-dearu-desumasu configuration",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "severity": {
                  "title": "Severity of lint messages",
                  "type": "string",
                  "enum": [
                    "error",
                    "warning",
                    "info"
                  ],
                  "default": "error"
                }
              }
            }
          ]
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
          "title": "textlint-rule-no-start-duplicated-conjunction configuration",
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
                },
                "severity": {
                  "title": "Severity of lint messages",
                  "type": "string",
                  "enum": [
                    "error",
                    "warning",
                    "info"
                  ],
                  "default": "error"
                }
              }
            }
          ]
        }
      },

    "textlint-rule-preset-jtf-style":
      {
        "name": "textlint-rule-preset-jtf-style",
        "key": "preset-jtf-style",
        "version": "2.1.2",
        "description": "JTF Style Guide for Translators Working into Japanese for textlint.",
        "author": "azu",
        "license": "MIT",
        "homepage": "https://github.com/azu/textlint-rule-preset-jtf-style",
        "isPreset": true,
        "rules": [
          {
            "name": "textlint-rule-prh",
            "key": "prh",
            "version": "2.4.1",
            "description": "textlint rule for prh.",
            "author": "azu",
            "license": "MIT",
            "homepage": "https://github.com/azu/textlint-rule-prh",
            "isPreset": false,
            "rules": [],
            "schema": null
          }
        ],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "textlint-rule-preset-jtf-style configuration",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "1.1.1.本文": {
                  "type": "boolean",
                  "default": true
                },
                "1.1.2.見出し": {
                  "type": "boolean",
                  "default": true
                },
                "1.1.3.箇条書き": {
                  "type": "boolean",
                  "default": true
                },
                "1.1.5.図表のキャプション": {
                  "type": "boolean",
                  "default": true
                },
                "1.2.1.句点(。)と読点(、)": {
                  "type": "boolean",
                  "default": true
                },
                "1.2.2.ピリオド(.)とカンマ(,)": {
                  "type": "boolean",
                  "default": true
                },
                "2.1.2.漢字": {
                  "type": "boolean",
                  "default": false
                },
                "2.1.5.カタカナ": {
                  "type": "boolean",
                  "default": false
                },
                "2.1.6.カタカナの長音": {
                  "type": "boolean",
                  "default": false
                },
                "2.1.8.算用数字": {
                  "type": "boolean",
                  "default": true
                },
                "2.1.9.アルファベット": {
                  "type": "boolean",
                  "default": true
                },
                "2.1.10.算用数字の位取りの表記": {
                  "type": "boolean",
                  "default": true
                },
                "2.2.1.ひらがなと漢字の使い分け": {
                  "type": "boolean",
                  "default": false
                },
                "2.2.2.算用数字と漢数字の使い分け": {
                  "type": "boolean",
                  "default": true
                },
                "2.2.3.一部の助数詞の表記": {
                  "type": "boolean",
                  "default": true
                },
                "3.1.1.全角文字と半角文字の間": {
                  "type": "boolean",
                  "default": true
                },
                "3.1.2.全角文字どうし": {
                  "type": "boolean",
                  "default": true
                },
                "3.2.カタカナ語間のスペースの有無": {
                  "type": "boolean",
                  "default": true
                },
                "3.3.かっこ類と隣接する文字の間のスペースの有無": {
                  "type": "boolean",
                  "default": true
                },
                "4.1.1.句点(。)": {
                  "type": "boolean",
                  "default": true
                },
                "4.1.3.ピリオド(.)、カンマ(,)": {
                  "type": "boolean",
                  "default": true
                },
                "4.2.1.感嘆符(！)": {
                  "type": "boolean",
                  "default": true
                },
                "4.2.2.疑問符(？)": {
                  "type": "boolean",
                  "default": true
                },
                "4.2.4.中黒(・)": {
                  "type": "boolean",
                  "default": true
                },
                "4.2.5.波線(〜)": {
                  "type": "boolean",
                  "default": true
                },
                "4.2.6.ハイフン(-)": {
                  "type": "boolean",
                  "default": true
                },
                "4.2.7.コロン(：)": {
                  "type": "boolean",
                  "default": true
                },
                "4.2.8.セミコロン(;)": {
                  "type": "boolean",
                  "default": true
                },
                "4.2.9.ダッシュ(-)": {
                  "type": "boolean",
                  "default": true
                },
                "4.3.1.丸かっこ（）": {
                  "type": "boolean",
                  "default": true
                },
                "4.3.2.大かっこ［］": {
                  "type": "boolean",
                  "default": true
                },
                "4.3.3.かぎかっこ「」": {
                  "type": "boolean",
                  "default": true
                },
                "4.3.4.二重かぎかっこ『』": {
                  "type": "boolean",
                  "default": true
                },
                "4.3.5.二重引用符": {
                  "type": "boolean",
                  "default": true
                },
                "4.3.6.中かっこ{ }": {
                  "type": "boolean",
                  "default": true
                },
                "4.3.7.山かっこ<>": {
                  "type": "boolean",
                  "default": true
                },
                "4.3.8.一重引用符": {
                  "type": "boolean",
                  "default": true
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
        "version": "1.4.1",
        "description": "textlint rule check english sentence using rousseau",
        "author": "azu",
        "license": "MIT",
        "homepage": "https://github.com/azu/textlint-rule-rousseau",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "textlint-rule-rousseau configuration",
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
                  "default": [
                    "suggestion",
                    "warning",
                    "error"
                  ],
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
                },
                "severity": {
                  "title": "Severity of lint messages",
                  "type": "string",
                  "enum": [
                    "error",
                    "warning",
                    "info"
                  ],
                  "default": "error"
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
          "title": "textlint-rule-sentence-length configuration",
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
                },
                "severity": {
                  "title": "Severity of lint messages",
                  "type": "string",
                  "enum": [
                    "error",
                    "warning",
                    "info"
                  ],
                  "default": "error"
                }
              }
            }
          ]
        }
      },

    "textlint-rule-sjsj":
      {
        "name": "textlint-rule-sjsj",
        "key": "sjsj",
        "version": "1.0.5",
        "description": "texlint rule check spell of Simplified JavaScript Jargon",
        "author": "azu",
        "license": "MIT",
        "homepage": "https://github.com/azu/textlint-rule-sjsj",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "textlint-rule-sjsj configuration",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "distance": {
                  "title": "Maximum edit distance from correct spelling",
                  "type": "integer",
                  "minimum": 1,
                  "default": 1
                },
                "severity": {
                  "title": "Severity of lint messages",
                  "type": "string",
                  "enum": [
                    "error",
                    "warning",
                    "info"
                  ],
                  "default": "error"
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
        "version": "5.0.0",
        "description": "textlint rule: spell check technical word for japanese.",
        "author": "azu",
        "license": "MIT",
        "homepage": "https://github.com/azu/textlint-rule-spellcheck-tech-word/",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "textlint-rule-spellcheck-tech-word configuration",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "severity": {
                  "title": "Severity of lint messages",
                  "type": "string",
                  "enum": [
                    "error",
                    "warning",
                    "info"
                  ],
                  "default": "error"
                }
              }
            }
          ]
        }
      },

    "textlint-rule-unexpanded-acronym":
      {
        "name": "textlint-rule-unexpanded-acronym",
        "key": "unexpanded-acronym",
        "version": "1.2.1",
        "description": "textlint rule that check unexpanded acronym word.",
        "author": "azu",
        "license": "MIT",
        "homepage": "https://github.com/azu/textlint-rule-unexpanded-acronym",
        "isPreset": false,
        "rules": [],
        "schema": {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "textlint-rule-unexpanded-acronym configuration",
          "oneOf": [
            {
              "title": "Enable this rule with default options",
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "min_acronym_len": {
                  "title": "Minimum size for the acronym",
                  "type": "integer",
                  "minimum": 1,
                  "default": 3
                },
                "max_acronym_len": {
                  "title": "Maximum size for the acronym",
                  "type": "integer",
                  "minimum": 1,
                  "default": 5
                },
                "ignore_acronyms": {
                  "title": "Ignoring acronym list",
                  "type": "array",
                  "items": {
                    "title": "Acronym",
                    "type": "string",
                    "minLength": 1
                  },
                  "uniqueItems": true
                },
                "severity": {
                  "title": "Severity of lint messages",
                  "type": "string",
                  "enum": [
                    "error",
                    "warning",
                    "info"
                  ],
                  "default": "error"
                }
              }
            }
          ]
        }
      },

  }
}
/* eslint-enable */
