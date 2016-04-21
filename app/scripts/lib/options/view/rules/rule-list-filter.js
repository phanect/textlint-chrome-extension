/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import React, { PropTypes } from "react";
import escapeStringRegexp from "escape-string-regexp";
import { translate } from "../../../util/chrome-util";

export default class RuleListFilter extends React.Component {
  static propTypes = {
    onFilterChange: PropTypes.func.isRequired,
  };

  handleFilterChange(filterString) {
    const words = _.reject((filterString || "").split(/\s+/), _.isEmpty);
    let newFilter = null;
    if (words.length > 0) {
      newFilter = new RegExp(words.map(escapeStringRegexp).join("|"), "i");
    }
    this.props.onFilterChange(newFilter);
  }

  render() {
    return (
      <div className="rule-list-filter form-inline">
        <div className="form-group">
          <label htmlFor="filter-input"><i className="fa fa-search"></i></label>
          <input
            type="search" className="form-control input-sm"
            placeholder={translate("search")}
            onChange={(e) => this.handleFilterChange(e.target.value)}
          />
        </div>
      </div>
    );
  }
}
