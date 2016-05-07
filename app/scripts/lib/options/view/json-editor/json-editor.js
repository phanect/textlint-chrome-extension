/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import _ from "lodash";
import React, { PropTypes } from "react";
import fixSchema from "./fix-schema";
import "./editor-multiselectize";
import "./editor-enumconstant";
import "./editor-checkboxed-editor";
import "./patch-fix-allow-empty-option";
import "./messages";

JSONEditor.defaults.options.theme = "bootstrap3";
JSONEditor.defaults.options.iconlib = "fontawesome4";
_.extend(JSONEditor.plugins.selectize, {
  enable: true,
  allowEmptyOption: true,
});

export default class JsonEditor extends React.Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    defaultValue: PropTypes.any,
    onReady: PropTypes.func,
    onChange: PropTypes.func,
  };

  componentDidMount() {
    const editor = new JSONEditor(this.refs.editor, {
      schema: fixSchema(_.clone(this.props.schema)),
      startval: this.props.defaultValue,
      disable_array_add: true,
      disable_array_delete: true,
      disable_array_reorder: true,
      disable_collapse: true,
      disable_edit_json: true,
      disable_properties: true,
      no_additional_properties: true,
      required_by_default: true,
    });
    editor.on("ready", () => {
      if (this.props.onReady) this.props.onReady(editor);
    });
    editor.on("change", () => {
      if (this.props.onChange) this.props.onChange(editor);
    });
    this.editor = editor;
  }
  componentWillUnmount() {
    this.editor = null;
  }

  validate() {
    return this.editor.validate();
  }
  serialize() {
    return this.editor.getValue();
  }

  render() {
    return (
      <div className="json-editor" ref="editor">
      </div>
    );
  }
}
