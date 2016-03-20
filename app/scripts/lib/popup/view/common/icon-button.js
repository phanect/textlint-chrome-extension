/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import {translate} from "../../../util/chrome-util";

const IconButton = React.createClass({
  propTypes: {
    icon: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    btn: React.PropTypes.string,
    size: React.PropTypes.string,
    active: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    onClick: React.PropTypes.func.isRequired,
  },
  render() {
    const {icon, label, btn, size, active, disabled} = this.props;

    const btnClass = [
      "icon-button",
      `${label}-button`,
      `btn btn-${btn || "default"}`,
      size ? `btn-${size}` : "",
      active ? "active" : "",
      disabled ? "disabled" : "",
    ].join(" ");

    return (
      <button className={btnClass} disabled={disabled} onClick={this.props.onClick}>
        <i className={`fa fa-${icon}`}></i>
        <span>{translate(label)}</span>
      </button>
    );
  }
});

export default IconButton;
