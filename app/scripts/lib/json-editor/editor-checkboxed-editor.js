"use strict";

import _ from "lodash";
import $ from "jquery";

JSONEditor.defaults.resolvers.unshift((schema) => {
  if (!schema.oneOf || schema.oneOf.length !== 2) return;
  if (_.find(schema.oneOf, (s) => s.type === "boolean" && s.enum && s.enum.length === 1)) {
    return "checkboxedEditor";
  }
});

JSONEditor.defaults.editors.checkboxedEditor = JSONEditor.AbstractEditor.extend({
  register() {
    if (this.editor) this.editor.register();
    this._super();
  },

  unregister() {
    this._super();
    if (this.editor) this.editor.unregister();
  },

  isCheckboxUsed() {
    return this.checkbox && (this.checkbox.checked === this.checkboxValue);
  },

  preBuild() {
    this.checkbox = null;
    this.editor = null;
    this.editorValidator = null;

    this.checkboxIndex = _.findIndex(this.schema.oneOf, (s) => s.type === "boolean" && s.enum && s.enum.length === 1);
    if (this.checkboxIndex < 0) throw "no constant boolean found in schema.oneOf";
    this.editorIndex = 1 - this.checkboxIndex;
    this.checkboxSchema = this.schema.oneOf[this.checkboxIndex];
    this.checkboxValue = this.checkboxSchema.enum[0];
    this.editorSchema = this.schema.oneOf[this.editorIndex];
  },

  build() {
    if (!this.options.compact) {
      this.header = this.label = this.theme.getCheckboxLabel(this.getTitle());
    }
    if (this.schema.description) this.description = this.theme.getFormInputDescription(this.schema.description);
    if (this.options.compact) $(this.container).addClass("compact");

    this.buildLabeledCheckbox();
    this.buildEditor();
  },

  buildLabeledCheckbox() {
    this.checkbox = this.theme.getCheckbox();
    $(this.checkbox).on("change", () => {
      this.refreshValue();
      this.onChange(true);
      return false;
    });

    this.labeledCheckbox = this.theme.getFormControl(this.label, this.checkbox, this.description);
    this.container.appendChild(this.labeledCheckbox);
  },

  buildEditor() {
    let schema;
    if (_.isString(this.editorSchema)) {
      schema = _.defaults({ type: this.editorSchema }, this.schema);
    } else {
      schema = _.clone(this.editorSchema);
    }

    this.editorHolder = document.createElement('div');
    this.container.appendChild(this.editorHolder);

    const holder = this.theme.getChildEditorHolder();
    this.editorHolder.appendChild(holder);

    const editorClass = this.jsoneditor.getEditorClass(schema);
    this.editor = this.jsoneditor.createEditor(editorClass, {
      jsoneditor: this.jsoneditor,
      schema: schema,
      container: holder,
      path: this.path,
      parent: this,
      required: true
    });
    this.editor.preBuild();
    this.editor.build();
    this.editor.postBuild();
    if (this.editor.header) $(this.editor.header).hide();

    const validatorOptions = {};
    if (this.jsoneditor.options.custom_validators) {
      validatorOptions.custom_validators = this.jsoneditor.options.custom_validators;
    }
    this.editorValidator = new JSONEditor.Validator(this.jsoneditor, schema, validatorOptions);
  },

  getNumColumns() {
    const checkboxNumColumns = Math.min(12, Math.max(2, this.getTitle().length / 7));
    if (!this.editor) return checkboxNumColumns;
    return Math.max(this.editor.getNumColumns(), checkboxNumColumns);
  },

  enable() {
    if (this.editor) this.editor.enable();
    this.checkbox.disabled = false;
    this._super();
  },

  disable() {
    if (this.editor) this.editor.disable();
    this.checkbox.disabled = true;
    this._super();
  },

  onChildEditorChange(editor) {
    if (this.editor) this.refreshValue();
    this._super();
  },

  refreshValue() {
    if (this.isCheckboxUsed()) {
      this.value = this.checkboxValue;
      if (this.editor) this.editor.disable();
    } else if (this.editor) {
      this.value = this.editor.getValue();
      this.editor.enable();
    }
  },

  setValue(val, initial) {
    if (val === this.checkboxValue) {
      this.checkbox.checked = val;
    } else {
      this.checkbox.checked = !this.checkboxValue;
      this.editor.setValue(val, initial);
    }
    this.refreshValue();
    this.onChange();
  },

  destroy() {
    if (this.editor) this.editor.destroy();
    $(this.labeledCheckbox).remove();
    $(this.editorHolder).remove();
    this._super();
  },

  showValidationErrors(errors) {
    if (!this.editor) return;
    const editorPath = `${this.path}.oneOf[${this.editorIndex}]`;
    const newErrors = [];
    _.each(errors, (error) => {
      if (_.startsWith(error.path, editorPath)) {
        const remainPath = error.path.substr(editorPath.length);
        newErrors.push(_.defaults({ path: `${this.path}${remainPath}` }, error));
      }
    });
    this.editor.showValidationErrors(newErrors);
  },
});
