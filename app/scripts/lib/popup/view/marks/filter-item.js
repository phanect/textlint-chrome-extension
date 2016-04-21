/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React, { PropTypes } from "react";
import { translate } from "../../../util/chrome-util";

export default class FilterItem extends React.Component {
  static propTypes = {
    severity: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    active: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const { severity, count, active } = this.props;
    return (
      <button
        className={`filter-item btn btn-link btn-sm ${active ? "active" : ""}`}
        onClick={() => this.props.onChange(severity, !active)}
      >
        <i className={`icon-${severity}`}></i>
        <span className="filter-item-count">{count}</span>
        <span>{translate(severity)}</span>
      </button>
    );
  }
}
