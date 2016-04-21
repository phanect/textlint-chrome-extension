/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import React, { PropTypes } from "react";
import JsonEditor from "../json-editor/json-editor";

export default class VisualEditor extends React.Component {
  static propTypes = {
    visualOptionsSchema: PropTypes.object.isRequired,
    visualOptions: PropTypes.object.isRequired,
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
    return (
      <JsonEditor
        ref="editor"
        schema={this.props.visualOptionsSchema}
        defaultValue={this.props.visualOptions}
        onReady={this.handleEditorReady}
      />
    );
  }
}
