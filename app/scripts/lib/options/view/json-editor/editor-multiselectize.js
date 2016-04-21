/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import _ from "lodash";
import $ from "jquery";

JSONEditor.defaults.resolvers.unshift((schema) => {
  if (schema.type === "array" && schema.items && _.isArray(schema.items.enum)) {
    return "multiSelectize";
  }
  return undefined;
});

JSONEditor.defaults.editors.multiSelectize = JSONEditor.AbstractEditor.extend({
  preBuild() {
    this._super();
    this.optionValues = [];
    this.valueDict = {};

    const itemsSchema = this.jsoneditor.expandRefs(this.schema.items || {});
    const enums = itemsSchema.enum || [];
    this.optionValues = _.map(enums, (opt) => `${opt}`);
    this.valueDict = _.fromPairs(_.map(enums, (opt) => [`${opt}`, opt]));
  },
  build() {
    this.title = this.theme.getFormInputLabel(this.getTitle());
    this.errorHolder = document.createElement("div");

    if (this.schema.description) {
      this.description = this.theme.getDescription(this.schema.description);
    }

    this.input_type = "select";
    this.input = this.theme.getSelectInput(this.optionValues);
    this.input.setAttribute("multiple", "multiple");

    const group = this.theme.getFormControl(this.title, this.input, this.description);
    this.container.appendChild(group);
    this.container.appendChild(this.errorHolder);

    $(this.input).selectize({
      delimiter: false,
      createOnBlur: true,
      create: true,
    });
  },
  postBuild() {
    this.input.selectize.on("change", () => {
      this.refreshValue();
      this.onChange(true);
    });
  },
  destroy() {
    $([this.title, this.description, this.input]).remove();
    this._super();
  },
  setValue(value, initial) {
    value = _.castArray(value || []);
    value = _.filter(value, (val) => this.valueDict[`${val}`]);
    if (this.schema.uniqueItems) {
      value = _.uniq(value);
    }
    this.input.selectize.setValue(value);
    this.refreshValue(initial);
  },
  refreshValue() {
    const selected = this.input.selectize.getValue();
    this.value = _.values(_.pick(this.valueDict, selected));
  },
  showValidationErrors(errors) {
    const $holder = $(this.errorHolder);
    $holder.empty();
    _.each(errors, (err) => {
      if (err.path === this.path) {
        $holder.append(this.theme.getErrorMessage(err.message));
      }
    });
  },
});
