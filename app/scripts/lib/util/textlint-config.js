"use strict";

import _ from "lodash";

const LANG_DEFAULT_PRESET = {
  en: "English",
  ja: "Japanese",
};

let customConfig = {
  name: "Custom",
  rules: [],
  ruleOptions: {}
};

let presets = [
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
  customConfig
];

export default {
  langDefaultPreset: LANG_DEFAULT_PRESET,
  presets: presets,

  getPreset(name) {
    return _.find(this.presets, ["name", name]);
  },

  getDefaultPreset(lang = null) {
    if (!lang && chrome && chrome.i18n) lang = chrome.i18n.getUILanguage();
    return this.getPreset(this.langDefaultPreset[lang] || this.langDefaultPreset["en"]);
  },

  updateCustomConfig(rules, ruleOptions) {
    customConfig.rules = rules;
    customConfig.ruleOptions = ruleOptions;
  },
}
