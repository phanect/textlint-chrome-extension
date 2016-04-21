/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import _ from "lodash";
import React, { PropTypes } from "react";
import FilterItem from "./filter-item";

export default class FilterList extends React.Component {
  static propTypes = {
    counts: PropTypes.objectOf(PropTypes.number).isRequired,
    actives: PropTypes.objectOf(PropTypes.bool).isRequired,
    onFilterChange: PropTypes.func.isRequired,
  };

  render() {
    const { counts, actives, onFilterChange } = this.props;
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
}
