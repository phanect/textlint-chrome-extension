/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import _ from "lodash";
import { TextLintCore } from "textlint";
import TextCaretScanner from "../util/text-caret-scanner";
import TextlintRulePackage from "./textlint-rule-package";

const PRESET_PREFIX_RE = /^preset-/;
const SEVERITY_NAMES = {
  0: "info",
  1: "warning",
  2: "error",
};

export default class TextlintWrapper {
  constructor(ruleNames, ruleOptions, format) {
    this.ruleNames = ruleNames;
    this.ruleOptions = ruleOptions;
    this.format = format || "txt";
    this.textlint = new TextLintCore();
    this.loadingPromise = null;
  }

  getTextlint() {
    if (!this.loadingPromise) {
      this.loadingPromise = new Promise((resolve, reject) => {
        const promises = _.map(this.ruleNames, (ruleName) => {
          return (new TextlintRulePackage(ruleName)).loadBundled();
        });
        Promise.all(promises).then((rules) => {
          const loadedRules = _.fromPairs(_.zip(this.ruleNames, rules));
          const flattenRules = this._flattenPreset(loadedRules, true);
          const flattenRuleOptions = this._flattenPreset(this.ruleOptions, false);
          this.textlint.setupRules(flattenRules, flattenRuleOptions);
          resolve(this.textlint);
        }).catch(reject);
      });
    }
    return this.loadingPromise;
  }

  lint(text) {
    return new Promise((resolve, reject) => {
      this.getTextlint().then((textlint) => {
        textlint.lintText(text, `.${this.format}`).then((lintResult) => {
          this._decorateMessages(text, lintResult.messages);
          resolve(lintResult);
        }).catch(reject);
      }).catch(reject);
    });
  }

  _decorateMessages(text, messages) {
    const scanner = new TextCaretScanner(text);
    _.each(messages, (msg) => {
      const range = scanner.getWordRangeFromLineColumn(msg.line, msg.column);
      msg.severity = SEVERITY_NAMES[msg.severity] || SEVERITY_NAMES[0];
      msg.correctable = _.isObject(msg.fix);
      msg.start = range[0];
      msg.end = range[1];
    });
  }

  fix(text) {
    return new Promise((resolve, reject) => {
      this.getTextlint().then((textlint) => {
        textlint.fixText(text, `.${this.format}`).then(resolve, reject);
      }).catch(reject);
    });
  }

  onLoad(callback) {
    this.getTextlint().then(callback);
  }
  onLoadError(callback) {
    this.getTextlint().catch(callback);
  }

  _flattenPreset(rules, isRule) {
    return _.reduce(rules, (accum, value, key) => {
      if (PRESET_PREFIX_RE.test(key)) {
        _.each(
          isRule ? value.rules : value,
          (subValue, subKey) => { accum[`${key}/${subKey}`] = subValue; }
        );
      } else {
        accum[key] = value;
      }
      return accum;
    }, {});
  }
}
