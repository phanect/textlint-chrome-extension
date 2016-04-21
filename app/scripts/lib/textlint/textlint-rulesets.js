/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import _ from "lodash";
import appConfig from "../app/app-config";
import AppOptions from "../app/app-options";

export default {
  getRuleset(name) {
    return new Promise((resolve, reject) => {
      if (name === "Custom") {
        this.getCustom().then((ruleOptions) => {
          resolve({
            name: "Custom",
            rules: _.keys(ruleOptions),
            ruleOptions,
          });
        }).catch(reject);
      } else {
        resolve(_.find(appConfig.rulesets, ["name", name]));
      }
    });
  },

  getDefaultRulesetName(lang = null) {
    if (!lang && chrome && chrome.i18n && typeof chrome.i18n.getUILanguage === "function") {
      lang = chrome.i18n.getUILanguage();
    }
    return appConfig.defaultRuleset[lang] || appConfig.defaultRuleset.en;
  },

  getDefaultRuleset(lang = null) {
    const name = this.getDefaultRulesetName(lang);
    return this.getRuleset(name);
  },

  getRulesetOrDefault(name) {
    return new Promise((resolve, reject) => {
      this.getRuleset(name).then((ruleset) => {
        if (ruleset) {
          resolve(ruleset);
        } else {
          this.getDefaultRuleset().then(resolve, reject);
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
};
