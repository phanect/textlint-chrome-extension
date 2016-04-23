/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import _ from "lodash";
import $ from "jquery";
import React, { PropTypes } from "react";
import { translate } from "@io-monad/chrome-util";
import fixSchema from "./fix-schema";
import "./editor-multiselectize";
import "./editor-enumconstant";
import "./editor-checkboxed-editor";
import "./messages";

JSONEditor.defaults.options.theme = "bootstrap3";
JSONEditor.defaults.options.iconlib = "fontawesome4";
JSONEditor.plugins.selectize.enable = true;

export default class JsonEditor extends React.Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    defaultValue: PropTypes.any,
    onReady: PropTypes.func,
    onChange: PropTypes.func,
  };

  componentDidMount() {
    const editor = new JSONEditor(this.refs.editor, {
      schema: fixSchema(this.props.schema),
      startval: this.props.defaultValue,
    });
    editor.on("ready", () => {
      this.translateLabels();
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

  translateLabels() {
    $(this.refs.editor).find("label").contents()
      .filter(function () {
        // Filter to only non-empty text nodes
        return this.nodeType === 3 && !/^\s*$/.test(this.nodeValue);
      })
      .each(function () {
        const key = _.camelCase(`label-${this.nodeValue}`).replace(/[^a-zA-Z0-9]+/g, "");
        if (/^label[A-Z][a-zA-Z0-9]+$/.test(key)) {
          this.nodeValue = translate(key, this.nodeValue);
        }
      });
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
