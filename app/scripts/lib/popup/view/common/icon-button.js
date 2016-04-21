/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React, { PropTypes } from "react";
import { translate } from "../../../util/chrome-util";

export default class IconButton extends React.Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    btn: PropTypes.string,
    size: PropTypes.string,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    const { icon, label, btn, size, active, disabled } = this.props;

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
}
