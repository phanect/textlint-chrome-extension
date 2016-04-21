/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import _ from "lodash";
import appStorage from "./app-storage";

const DEFAULT_OPTIONS = {
  showMarks: true,
  showBorder: true,
  badgeCountSeverity: "error",
  ruleOptions: {},
};

const CONTENT_OPTIONS = [
  "showMarks",
  "showBorder",
];

const VISUAL_OPTIONS = [
  "showMarks",
  "showBorder",
  "badgeCountSeverity",
];
const VISUAL_OPTIONS_SCHEMA = {
  "type": "object",
  "required": [
    "showMarks",
    "showBorder",
    "badgeCountSeverity",
  ],
  "properties": {
    "showMarks": {
      "title": "Show markers of hint messages in text area",
      "type": "boolean",
      "default": true,
    },
    "showBorder": {
      "title": "Highlight border of text area",
      "type": "boolean",
      "default": true,
    },
    "badgeCountSeverity": {
      "title": "Type of messages to show the sum as badge",
      "type": "string",
      "enum": [
        "error",
        "error,warning",
        "error,warning,info",
        "none",
      ],
      "default": "error,warning,info",
      "options": {
        "enum_titles": [
          chrome.i18n.getMessage("labelErrors"),
          chrome.i18n.getMessage("labelErrorsAndWarnings"),
          chrome.i18n.getMessage("labelEverything"),
          chrome.i18n.getMessage("labelNone"),
        ],
      },
    },
  },
};

export default class AppOptions {
  static load() {
    return new Promise((resolve, reject) => {
      appStorage.getOptions().then((options) => {
        resolve(new AppOptions(options));
      }).catch(reject);
    });
  }

  constructor(options) {
    this.options = _.defaultsDeep(options, DEFAULT_OPTIONS);
  }

  get(keys) {
    return _.isArray(keys) ? _.pick(this.options, keys) : this.options[keys];
  }
  set(options) {
    this.options = _.defaultsDeep(options, this.options);
  }
  overwrite(options) {
    this.options = _.defaultsDeep(options, DEFAULT_OPTIONS);
  }
  valueOf() {
    return this.options;
  }
  toObject() {
    return this.options;
  }

  get contentOptions() {
    return _.pick(this.options, CONTENT_OPTIONS);
  }

  get visualOptionsSchema() {
    return VISUAL_OPTIONS_SCHEMA;
  }
  get visualOptions() {
    return _.pick(this.options, VISUAL_OPTIONS);
  }
  set visualOptions(v) {
    v = _.pick(v || {}, VISUAL_OPTIONS);
    _.extend(this.options, v);
  }

  get showMarks() {
    return this.options.showMarks;
  }
  set showMarks(v) {
    this.options.showMarks = v;
  }
  get showBorder() {
    return this.options.showBorder;
  }
  set showBorder(v) {
    this.options.showBorder = v;
  }
  get badgeCountSeverity() {
    const val = this.options.badgeCountSeverity;
    if (val === "none") return [];
    return _.isString(val) ? val.split(",") : _.castArray(val);
  }
  set badgeCountSeverity(v) {
    if (_.isArray(v) && v.length === 0) v = "none";
    this.options.badgeCountSeverity = _.isArray(v) ? v.join(",") : v;
  }

  getRuleOption(ruleName) {
    ruleName = ruleName.replace(/^textlint-rule-/, "");
    return this.ruleOptions[ruleName];
  }
  get ruleOptions() {
    return this.options.ruleOptions;
  }
  set ruleOptions(v) {
    this.options.ruleOptions = v;
  }

  load() {
    return new Promise((resolve, reject) => {
      appStorage.getOptions().then((options) => {
        this.overwrite(options);
        resolve(this);
      }).catch(reject);
    });
  }
  save() {
    return appStorage.setOptions(this.toObject());
  }

  observeUpdate(callback) {
    appStorage.observeOptionsUpdate(({ oldValue, newValue }) => {
      this.overwrite(newValue);
      callback.call(this, { oldValue, newValue });
    });
  }
}
