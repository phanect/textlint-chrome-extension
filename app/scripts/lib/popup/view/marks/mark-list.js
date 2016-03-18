/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import React from "react";
import {translate} from "../../../util/chrome-util";
import MarkItem from "./mark-item";

const MarkList = React.createClass({
  propTypes: {
    actives: React.PropTypes.objectOf(React.PropTypes.bool).isRequired,
    marks: React.PropTypes.arrayOf(React.PropTypes.shape({
      markId: React.PropTypes.string.isRequired,
      severity: React.PropTypes.string.isRequired,
    })).isRequired,
    onMarkClick: React.PropTypes.func.isRequired,
    onUndismissClick: React.PropTypes.func.isRequired,
    onDismissThisClick: React.PropTypes.func.isRequired,
    onDismissSameClick: React.PropTypes.func.isRequired,
  },
  getFilteredMarks() {
    const {actives} = this.props;
    return _.filter(this.props.marks, m => actives[m.dismissed ? "dismissed" : m.severity]);
  },
  render() {
    const filteredMarks = this.getFilteredMarks();
    return (
      <div className="mark-list">
        {filteredMarks.map(mark =>
          <MarkItem
            key={mark.markId}
            mark={mark}
            onMarkClick={() => this.props.onMarkClick(mark.markId)}
            onUndismissClick={() => this.props.onUndismissClick(mark.markId)}
            onDismissThisClick={() => this.props.onDismissThisClick(mark.markId)}
            onDismissSameClick={() => this.props.onDismissSameClick(mark.markId)}
          />
        )}
      </div>
    );
  }
});

export default MarkList;
