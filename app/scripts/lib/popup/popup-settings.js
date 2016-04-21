/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import _ from "lodash";
import appStorage from "../app/app-storage";
import textlintRulesets from "../textlint/textlint-rulesets";

const DEFAULT_SETTINGS = {
  ruleset: null, // textlintRulesets.getDefaultRulesetName()
  format: "txt",
};

export default class PopupSettings {
  static load() {
    return appStorage.getPopupSettings().then(settings => {
      return new PopupSettings(settings);
    });
  }

  constructor(settings) {
    this.overwrite(settings);
  }
  overwrite(settings) {
    this.settings = _.defaultsDeep(settings, DEFAULT_SETTINGS);
  }
  valueOf() {
    return this.settings;
  }
  toObject() {
    return this.settings;
  }

  get ruleset() {
    return this.settings.ruleset || textlintRulesets.getDefaultRulesetName();
  }
  set ruleset(name) {
    this.settings.ruleset = name;
  }

  get format() {
    return this.settings.format;
  }
  set format(name) {
    this.settings.format = name;
  }

  load() {
    return appStorage.getPopupSettings().then((settings) => {
      this.overwrite(settings);
      return this;
    });
  }
  save() {
    return appStorage.setPopupSettings(this.toObject());
  }
}
