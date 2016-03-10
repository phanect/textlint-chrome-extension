"use strict";

import _ from "lodash";
import {TextLintCore} from "textlint";
import TextCaretScanner from "../util/text-caret-scanner";
import TextlintRulePackage from "./textlint-rule-package";

const SEVERITY_NAMES = {
  0: "info",
  1: "warning",
  2: "error"
};

const PRESET_PREFIX_RE = /^preset-/;

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
          const flattenRules = this._flattenPreset(_.fromPairs(_.zip(this.ruleNames, rules)));
          this.textlint.setupRules(flattenRules, this.ruleOptions);
          resolve(this.textlint);
        }).catch(reject);
      });
    }
    return this.loadingPromise;
  }

  lint(text) {
    return new Promise((resolve, reject) => {
      this.getTextlint().then((textlint) => {
        textlint.lintText(text, `.${this.format}`).then(({messages}) => {
          resolve(this._buildLintMessages(text, messages));
        }).catch(reject);
      }).catch(reject);
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
