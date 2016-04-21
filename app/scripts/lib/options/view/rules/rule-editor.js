/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React, { PropTypes } from "react";
import JsonEditor from "../json-editor/json-editor";

export default class RuleEditor extends React.Component {
  static propTypes = {
    rule: PropTypes.shape({
      key: PropTypes.string.isRequired,
      schema: PropTypes.object.isRequired,
      options: PropTypes.any,
    }).isRequired,
    onReady: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleEditorReady = this.handleEditorReady.bind(this);
  }

  handleEditorReady() {
    this.props.onReady(this.refs.editor);
  }

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
  }
}
