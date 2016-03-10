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
