"use strict";

import $ from "jquery";

const editor = new JSONEditor($("#rule-editor")[0], {
  form_name_root: "ruleOptions",
  iconlib: "fontawesome4"
});
