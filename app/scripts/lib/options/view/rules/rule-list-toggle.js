/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React, { PropTypes } from "react";
import { translate } from "../../../util/chrome-util";

export default class RuleListToggle extends React.Component {
  static propTypes = {
    onTurnOnClick: PropTypes.func.isRequired,
    onTurnOffClick: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="rule-list-toggle">
        <button className="btn btn-default btn-sm icon-button" onClick={this.props.onTurnOnClick}>
          <i className="fa fa-toggle-on"></i>
          <span>{translate("turnOnAll")}</span>
        </button>
        <button className="btn btn-default btn-sm icon-button" onClick={this.props.onTurnOffClick}>
          <i className="fa fa-toggle-off"></i>
          <span>{translate("turnOffAll")}</span>
        </button>
      </div>
    );
  }
}
