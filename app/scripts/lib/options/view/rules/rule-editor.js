/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import JsonEditor from "../json-editor/json-editor";

const RuleEditor = React.createClass({
  propTypes: {
    rule: React.PropTypes.shape({
      key: React.PropTypes.string.isRequired,
      schema: React.PropTypes.object.isRequired,
      options: React.PropTypes.any,
    }).isRequired,
    onReady: React.PropTypes.func.isRequired,
  },
  handleEditorReady() {
    this.props.onReady(this.refs.editor);
  },
  render() {
    const { rule } = this.props;
    return (
      <JsonEditor
        ref="editor"
        schema={rule.schema}
        defaultValue={rule.options}
        onReady={this.handleEditorReady}
      />
    );
  },
});

export default RuleEditor;
