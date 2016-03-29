/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import { translate } from "../../../util/chrome-util";

const FilterItem = React.createClass({
  propTypes: {
    severity: React.PropTypes.string.isRequired,
    count: React.PropTypes.number.isRequired,
    active: React.PropTypes.bool.isRequired,
    onChange: React.PropTypes.func.isRequired,
  },
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
  },
});

export default FilterItem;
