"use strict";

import _ from "lodash";
import $ from "jquery";

JSONEditor.defaults.resolvers.unshift((schema) => {
  if (schema.enum && schema.enum.length === 1) {
    return "enumConstant";
  }
});

JSONEditor.defaults.editors.enumConstant = JSONEditor.AbstractEditor.extend({
  preBuild() {
    this.value = this.schema.enum[0];
  },
  build() {
    if (!this.options.compact) {
      this.title = this.theme.getFormInputLabel(this.getTitle());
    }
    if (this.schema.description) {
      this.description = this.theme.getDescription(this.schema.description);
    }

    this.container.appendChild(this.theme.getDescription("" + this.value));

    this.input_type = "hidden";
    this.input = this.theme.getFormInputField(this.input_type);
  },
  destroy() {
    if (this.input && this.input.parentNode) {
      this.input.parentNode.removeChild(this.input);
    }
    this._super();
  },
  getValue() {
    return this.value;
  },
  setValue(value, initial) {
    this.onChange();
  },
});
