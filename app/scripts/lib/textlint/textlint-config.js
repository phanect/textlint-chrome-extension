"use strict";

import _ from "lodash";
import appConfig from "../app/app-config";
import AppOptions from "../app/app-options";

export default {
  presets: appConfig.presets,
  defaultPreset: appConfig.defaultPreset,

  getPreset(name) {
    return new Promise((resolve, reject) => {
      if (name === "Custom") {
        this.getCustom().then((ruleOptions) => {
          resolve({
            name: "Custom",
            rules: _.keys(ruleOptions),
            ruleOptions: ruleOptions,
          });
        }).catch(reject);
      } else {
        resolve(_.find(this.presets, ["name", name]));
      }
    });
  },

  getDefaultPreset(lang = null) {
    if (!lang && chrome && chrome.i18n) lang = chrome.i18n.getUILanguage();
    return this.getPreset(this.defaultPreset[lang] || this.defaultPreset["en"]);
  },

  getPresetOrDefault(name) {
    return new Promise((resolve, reject) => {
      this.getPreset(name).then((preset) => {
        if (preset) {
          resolve(preset);
        } else {
          this.getDefaultPreset().then(resolve, reject);
        }
      }).catch(reject);
    });
  },

  getCustom() {
    return new Promise((resolve, reject) => {
      AppOptions.load().then((appOptions) => {
        resolve(_.pickBy(appOptions.ruleOptions));
      }).catch(reject);
    });
  },
}
