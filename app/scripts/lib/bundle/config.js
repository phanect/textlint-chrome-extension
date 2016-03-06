"use strict";

export default {
  bundles: {
    english: (cb) => { require(["../../bundle/english"], cb) },
    japanese: (cb) => { require(["../../bundle/japanese"], cb) },
  },

  rules: {
    "textlint-rule-alex": "english",
    "textlint-rule-rousseau": "english",
    "textlint-rule-preset-japanese": "japanese",
    "textlint-rule-general-novel-style-ja": "japanese",
  },

  presets: [
    {
      name: "English",
      rules: ["rousseau", "alex"],
      ruleOptions: {
        "rousseau": true,
        "alex": true,
      }
    },
    {
      name: "Japanese",
      rules: ["preset-japanese"],
      ruleOptions: {
        "preset-japanese": true,
      }
    },
    {
      name: "JapaneseNovel",
      rules: ["preset-japanese", "general-novel-style-ja"],
      ruleOptions: {
        "preset-japanese": true,
        "general-novel-style-ja": true,
      }
    }
  ],

  defaultPreset: {
    en: "English",
    ja: "Japanese",
  },
};
