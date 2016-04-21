/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import _ from "lodash";
import appConfig from "../app/app-config";
import AppOptions from "../app/app-options";

export default {
  getRuleset(name) {
    if (name === "Custom") {
      return this.getCustom().then((ruleOptions) => {
        return {
          name: "Custom",
          rules: _.keys(ruleOptions),
          ruleOptions,
        };
      });
    } else {
      return Promise.resolve(_.find(appConfig.rulesets, ["name", name]));
    }
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
    return this.getRuleset(name).then((ruleset) => {
      if (ruleset) {
        return ruleset;
      } else {
        return this.getDefaultRuleset();
      }
    });
  },

  getCustom() {
    return AppOptions.load().then((appOptions) => {
      return _.pickBy(appOptions.ruleOptions);
    });
  },
};
