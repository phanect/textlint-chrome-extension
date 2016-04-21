/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React, { PropTypes } from "react";
import VisualEditor from "./visual-editor";

export default class VisualPage extends React.Component {
  static propTypes = {
    appOptions: PropTypes.object.isRequired,
    onReady: PropTypes.func.isRequired,
  };

  render() {
    const { appOptions } = this.props;
    return (
      <div className="visual-page">
        <VisualEditor
          visualOptionsSchema={appOptions.visualOptionsSchema}
          visualOptions={appOptions.visualOptions}
          onReady={this.props.onReady}
        />
      </div>
    );
  }
}
