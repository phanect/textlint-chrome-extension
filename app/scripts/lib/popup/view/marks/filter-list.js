/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import React from "react";
import FilterItem from "./filter-item";

const FilterList = React.createClass({
  propTypes: {
    counts: React.PropTypes.objectOf(React.PropTypes.number).isRequired,
    actives: React.PropTypes.objectOf(React.PropTypes.bool).isRequired,
    onFilterChange: React.PropTypes.func.isRequired,
  },
  render() {
    const {counts, actives, onFilterChange} = this.props;
    return (
      <div className="filter-list btn-group">
        {_.map(counts, (count, severity) =>
          <FilterItem
            key={severity}
            severity={severity}
            count={count}
            active={actives[severity] || false}
            onChange={onFilterChange}
          />
        )}
      </div>
    );
  }
});

export default FilterList;
