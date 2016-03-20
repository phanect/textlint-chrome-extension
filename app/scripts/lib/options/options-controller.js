/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import React from "react";
import ReactDOM from "react-dom";
import AppOptions from "../app/app-options";
import bundles from "../app/bundles";
import OptionsView from "./view/options-view";
import RuleOptionsFixer from "./rule-options-fixer";

export default class OptionsController {
  constructor() {
    this.container = document.getElementById("container");
    this.appOptions = null;
  }

  start() {
    AppOptions.load().then((appOptions) => {
      this.appOptions = appOptions;
      this.renderView();
    });
  }

  renderView() {
    ReactDOM.render(
      <OptionsView
        controller={this}
        bundles={this.getBundles()}
        rules={this.getRules()}
        appOptions={this.appOptions}
        appVersion={this.getAppVersion()}
        appStoreURL={this.getAppStoreURL()}
      />,
      this.container
    );
  }

  getAppVersion() {
    return chrome.runtime.getManifest().version;
  }

  getAppStoreURL() {
    const extensionId = chrome.i18n.getMessage("@@extension_id");
    return `https://chrome.google.com/webstore/detail/currently/${extensionId}/reviews`;
  }

  getBundles() {
    return [bundles.textlint].concat(_.sortBy(bundles.bundles, "name"));
  }

  getRules() {
    return _.map(bundles.bundles, (rule) => {
      const options = this.appOptions.getRuleOption(rule.key);
      const fixedOptions = RuleOptionsFixer.fixOptionsForEditor(options);

      let severity;
      if (rule.isPreset) {
        const first = _.isObject(options) && _.find(options, "severity");
        severity = (_.isObject(first) && first.severity) || "error";
      } else {
        severity = (_.isObject(options) && options.severity) || "error";
      }

      return _.defaults({
        enabled: !!fixedOptions,
        severity: severity,
        options: fixedOptions,
      }, rule)
    });
  }

  save(ruleSettings, visualOptions) {
    const ruleOptions = {};
    _.each(ruleSettings, ({options, severity}, ruleKey) => {
      ruleOptions[ruleKey] = RuleOptionsFixer.fixOptionsForStorage(options, ruleKey, severity);
    });

    this.appOptions.ruleOptions = ruleOptions;
    this.appOptions.visualOptions = visualOptions;
    this.appOptions.save().then(() => {
      DEBUG && console.log("Saved ", this.appOptions.toObject());
      // window.close();
    });
  }
}
