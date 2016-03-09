"use strict";

import _ from "lodash";
import appConfig from "../app/app-config";
import appStorage from "../app/app-storage";
import AppOptions from "../app/app-options";

let customConfig = {
  name: "Custom",
  rules: [],
  ruleOptions: {}
};

export default {
  presets: _.concat(appConfig.presets, customConfig),
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
      appStorage.getOptions().then((options) => {
        const opts = new AppOptions(options);
        const filtered = _.pickBy(opts.ruleOptions);
        resolve(filtered);
      }).catch(reject);
    });
  },
}
