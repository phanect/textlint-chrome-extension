"use strict";

const LOCALE_DEFAULT = {
  en: "English",
  ja: "Japanese",
};

let customPreset = {
  name: "Custom",
  rules: [],
  ruleOptions: {}
};

export default {
  localeDefault: LOCALE_DEFAULT,

  updateCustom(rules, ruleOptions) {
    customPreset.rules = rules;
    customPreset.ruleOptions = ruleOptions;
  },

  presets: [
    {
      name: "English",
      rules: [
        "rousseau",
        "alex",
      ],
      ruleOptions: {
        "rousseau": true,
        "alex": true,
      }
    },
    {
      name: "Japanese",
      rules: [
        "preset-japanese",
      ],
      ruleOptions: {
        "preset-japanese": true,
      }
    },
    {
      name: "JapaneseNovel",
      rules: [
        "preset-japanese",
        "general-novel-style-ja",
      ],
      ruleOptions: {
        "preset-japanese": true,
        "general-novel-style-ja": true,
      }
    },
    customPreset
  ]
}
