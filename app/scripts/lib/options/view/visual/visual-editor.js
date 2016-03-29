/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import JsonEditor from "../json-editor/json-editor";

const VisualEditor = React.createClass({
  propTypes: {
    visualOptionsSchema: React.PropTypes.object.isRequired,
    visualOptions: React.PropTypes.object.isRequired,
    onReady: React.PropTypes.func.isRequired,
  },
  handleEditorReady() {
    this.props.onReady(this.refs.editor);
  },
  render() {
    return (
      <JsonEditor
        ref="editor"
        schema={this.props.visualOptionsSchema}
        defaultValue={this.props.visualOptions}
        onReady={this.handleEditorReady}
      />
    );
  },
});

export default VisualEditor;
