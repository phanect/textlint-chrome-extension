"use strict";

import _ from "lodash";
import bundleConfig from "../bundle/config";

let customConfig = {
  name: "Custom",
  rules: [],
  ruleOptions: {}
};

export default {
  presets: _.concat(bundleConfig.presets, customConfig),
  defaultPreset: bundleConfig.defaultPreset,

  getPreset(name) {
    return _.find(this.presets, ["name", name]);
  },

  getDefaultPreset(lang = null) {
    if (!lang && chrome && chrome.i18n) lang = chrome.i18n.getUILanguage();
    return this.getPreset(this.defaultPreset[lang] || this.defaultPreset["en"]);
  },

  updateCustomConfig(rules, ruleOptions) {
    customConfig.rules = rules;
    customConfig.ruleOptions = ruleOptions;
  },
}
