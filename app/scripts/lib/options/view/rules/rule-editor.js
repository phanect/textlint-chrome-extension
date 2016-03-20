/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import React from "react";
import {translate} from "../../../util/chrome-util";
import JsonEditor from "../json-editor/json-editor";
import RuleOptionsFixer from "./rule-options-fixer";

const RuleEditor = React.createClass({
  propTypes: {
    rule: React.PropTypes.shape({
      key: React.PropTypes.string.isRequired,
      schema: React.PropTypes.object.isRequired,
      options: React.PropTypes.any,
    }).isRequired,
    severity: React.PropTypes.string.isRequired,
    onReady: React.PropTypes.func.isRequired,
  },
  handleEditorReady() {
    this.props.onReady({
      validate: this.validate,
      serialize: this.serialize,
    });
  },
  validate() {
    return this.refs.editor.validate();
  },
  serialize() {
    const values = this.refs.editor.serialize();
    const {rule, severity} = this.props;
    return RuleOptionsFixer.fixOptionsForStorage(values, rule, severity);
  },
  render() {
    const {rule} = this.props;
    const fixedOptions = RuleOptionsFixer.fixOptionsForEditor(rule.options);
    return (
      <JsonEditor
        ref="editor"
        schema={rule.schema}
        defaultValue={fixedOptions}
        onReady={this.handleEditorReady}
      />
    );
  }
});

export default RuleEditor;
