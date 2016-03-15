/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";

export default class OptionsEditor {
  constructor(editors) {
    this.editors = editors;
  }

  init(appOptions) {
    return Promise.all(
      _.map(this.editors, _.method("init", appOptions))
    );
  }

  validate() {
    return _.every(this.editors, _.method("validate"));
  }

  save(appOptions) {
    _.each(this.editors, _.method("save", appOptions));
  }
}
