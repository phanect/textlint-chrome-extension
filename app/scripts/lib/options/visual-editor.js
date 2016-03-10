"use strict";

import _ from "lodash";
import $ from "jquery";
import fixSchema from "../json-editor/fix-schema";

export default class VisualEditor {
  constructor() {
    this.$editor = $("#visual-editor");
    this.editor = null;
  }

  init(appOptions) {
    return new Promise((resolve, reject) => {
      this.editor = new JSONEditor(this.$editor[0], {
        form_name_root: "visual",
        schema: fixSchema(appOptions.visualOptionsSchema),
        startval: appOptions.visualOptions,
      });
      this.editor.on("ready", () => { resolve(this.editor) });
    });
  }

  validate() {
    if (this.editor.validate().length > 0) {
      $("a[href='#visual']").tab("show");
      return false;
    }
    return true;
  }

  save(appOptions) {
    appOptions.visualOptions = this.editor.getValue();
  }
}
