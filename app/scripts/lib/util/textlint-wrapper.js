"use strict";

import _ from "lodash";
import {TextLintCore} from "textlint";
import TextCaretScanner from "./text-caret-scanner";
import TextlintRulePackage from "./textlint-rule-package";

const SEVERITY_NAMES = {
  0: "info",
  1: "warning",
  2: "error"
};

const PRESET_PREFIX_RE = /^preset-/;

export default class TextlintWrapper {
  constructor(ruleNames, ruleOptions) {
    this.ruleNames = ruleNames;
    this.ruleOptions = ruleOptions;
    this.textlint = new TextLintCore();
    this.loadingPromise = null;
    this.loaded = false;
    this.loadingFailed = false;
    this.lintStackCount = 0;
  }

  getTextlint() {
    if (!this.loadingPromise) {
      this.loadingPromise = new Promise((resolve, reject) => {
        const promises = _.map(this.ruleNames, (ruleName) => {
          return (new TextlintRulePackage(ruleName)).loadBundledOrLatest();
        });
        Promise.all(promises).then((rules) => {
          const flattenRules = this._flattenPreset(_.fromPairs(_.zip(this.ruleNames, rules)));
          this.textlint.setupRules(flattenRules, this.ruleOptions);
          resolve(this.textlint);
        }).catch(reject);
      });

      this.loadingPromise.then(() => {
        this.loaded = true;
        console.log("textlint and rules have been successfully loaded.");
      }).catch((reason) => {
        this.loadingFailed = true;
        console.error("Error occurred while loading textlint and rules: ", reason);
      });
    }
    return this.loadingPromise;
  }

  lint(text) {
    return new Promise((resolve, reject) => {
      this.lintStackCount++;
      let rejectCatch = (error) => {
        this.lintStackCount--;
        reject(error);
      };

      this.getTextlint().then((textlint) => {
        textlint.lintText(text).then(({messages}) => {
          this.lintStackCount--;
          resolve(this._buildLintMessages(text, messages));
        }).catch(rejectCatch);
      }).catch(rejectCatch);
    });
  }

  getSeverities() {
    return _.values(SEVERITY_NAMES);
  }

  onLoad(callback) {
    this.getTextlint().then(callback);
  }
  onLoadError(callback) {
    this.getTextlint().catch(callback);
  }

  isLoaded() {
    return this.loaded;
  }
  isLoadingFailed() {
    return this.loadingFailed;
  }
  isLinting() {
    return this.lintStackCount > 0;
  }

  getStatus() {
    return {
      loaded: this.isLoaded(),
      loadingFailed: this.isLoadingFailed(),
      linting: this.isLinting(),
    };
  }

  _flattenPreset(rules) {
    return _.reduce(rules, (accum, value, key) => {
      if (PRESET_PREFIX_RE.test(key)) {
        _.each(value.rules, (rule, name) => { accum[`${key}/${name}`] = rule });
      } else {
        accum[key] = value;
      }
      return accum;
    }, {});
  }

  _buildLintMessages(text, messages) {
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
}
