/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React, { PropTypes } from "react";
import { translate } from "../../../util/chrome-util";

export default class PagePanel extends React.Component {
  static propTypes = {
    active: PropTypes.bool,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    children: PropTypes.any,
  };

  render() {
    const { active, title, icon } = this.props;
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
}
