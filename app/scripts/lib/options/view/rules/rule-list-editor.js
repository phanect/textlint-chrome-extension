/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import React from "react";
import {translate} from "../../../util/chrome-util";
import RuleList from "./rule-list";

const RuleListEditor = React.createClass({
  propTypes: {
    rules: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    onReady: React.PropTypes.func.isRequired,
  },

  componentWillMount() {
    this.editors = {};
    this.editorCount = 0;
  },
  handleEditorReady(ruleKey, editor) {
    this.editors[ruleKey] = editor;
    this.editorCount++;
    if (this.editorCount === this.props.rules.length) {
      this.props.onReady(this);
    }
  },

  validate() {
    let errors = [], location;
    _.each(this.editors, (editor, ruleKey) => {
      if (this.refs.ruleList.isRuleEnabled(ruleKey)) {
        errors = errors.concat(editor.validate());
        if (errors.length > 0 && !location) {
          location = `#rule-item-${ruleKey}`;
        }
      }
    });
    if (location) errors.location = location;
    return errors;
  },
  serialize() {
    const serialized = {};
    const ruleList = this.refs.ruleList;
    _.each(this.editors, (editor, ruleKey) => {
      if (ruleList.isRuleEnabled(ruleKey)) {
        serialized[ruleKey] = {
          options: editor.serialize(),
          severity: ruleList.getRuleSeverity(ruleKey),
        };
      }
    });
    return serialized;
  },

  render() {
    return (
      <RuleList
        ref="ruleList"
        rules={this.props.rules}
        onEditorReady={this.handleEditorReady}
      />
    );
  }
});

export default RuleListEditor;
