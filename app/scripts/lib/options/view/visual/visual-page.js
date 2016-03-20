/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import {translate} from "../../../util/chrome-util";
import VisualEditor from "./visual-editor";

const VisualPage = React.createClass({
  propTypes: {
    appOptions: React.PropTypes.object.isRequired,
    onReady: React.PropTypes.func.isRequired,
  },
  render() {
    const {appOptions} = this.props;
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
});

export default VisualPage;
