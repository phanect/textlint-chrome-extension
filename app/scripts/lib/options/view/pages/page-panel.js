/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import {translate} from "../../../util/chrome-util";

const PagePanel = React.createClass({
  propTypes: {
    active: React.PropTypes.bool,
    title: React.PropTypes.string.isRequired,
    icon: React.PropTypes.string.isRequired,
  },
  render() {
    const {active, title, icon} = this.props;
    return (
      <div className={`tab-pane page-panel fade ${active ? "in active" : ""}`}>
        <h1>
          <i className={`fa fa-${icon}`}></i>
          <span>{translate(title)}</span>
        </h1>
        {this.props.children}
      </div>
    );
  }
});

export default PagePanel;
