"use strict";

import _ from "lodash";
import {textlint} from "textlint";
import TextCaretScanner from "./text-caret-scanner";
import TextlintRulePackage from "./textlint-rule-package";

const SEVERITY_NAMES = {
  0: "info",
  1: "warning",
  2: "error"
};

// TODO: Options to switch loading rules
let loadingRules = [
  "general-novel-style-ja",
];

let ruleOptions = {
  "general-novel-style-ja": true
};

let loaded = false;
let loadingFailed = false;
let loadingPromise;

const getTextlint = () => {
  return loadingPromise || (loadingPromise = new Promise((resolve, reject) => {
    const promises = _.map(loadingRules, (ruleName) => {
      return (new TextlintRulePackage(ruleName)).loadLatest();
    });
    Promise.all(promises).then((rules) => {
      const nameToRule = _.fromPairs(_.zip(loadingRules, rules));
      textlint.setupRules(nameToRule, ruleOptions);
      resolve(textlint);
    }).catch(reject);
  }));
};

getTextlint().then(() => {
  loaded = true;
  console.log("textlint and rules have been successfully loaded.");
}).catch((reason) => {
  loadingFailed = true;
  console.error("Error occurred while loading textlint and rules: ", reason);
});

function buildLintMessages(text, messages) {
  let scanner = new TextCaretScanner(text);
  return _.map(messages, (m) => {
    let range = scanner.getWordRangeFromLineColumn(m.line, m.column);
    return {
      "start":    range[0],
      "end":      range[1],
      "message":  m.message,
      "ruleId":   m.ruleId,
      "severity": SEVERITY_NAMES[m.severity] || SEVERITY_NAMES[0]
    };
  });
}

let lintStackCount = 0;

export default {
  onLoad(callback) {
    getTextlint().then(callback);
  },
  onLoadError(callback) {
    getTextlint().catch(callback);
  },

  lint(text) {
    return new Promise((resolve, reject) => {
      lintStackCount++;
      let rejectCatch = (error) => {
        lintStackCount--;
        reject(error);
      };

      getTextlint().then((textlint) => {
        textlint.lintText(text).then(({messages}) => {
          lintStackCount--;
          resolve(buildLintMessages(text, messages));
        }).catch(rejectCatch);
      }).catch(rejectCatch);
    });
  },

  isLoaded() {
    return loaded;
  },
  isLoadingFailed() {
    return loadingFailed;
  },
  isLinting() {
    return lintStackCount > 0;
  },

  getStatus() {
    return {
      loaded: this.isLoaded(),
      loadingFailed: this.isLoadingFailed(),
      linting: this.isLinting(),
    };
  },
};
