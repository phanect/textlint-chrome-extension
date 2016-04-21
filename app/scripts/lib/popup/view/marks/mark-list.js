/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import _ from "lodash";
import React, { PropTypes } from "react";
import MarkItem from "./mark-item";

export default class MarkList extends React.Component {
  static propTypes = {
    actives: PropTypes.objectOf(PropTypes.bool).isRequired,
    marks: PropTypes.arrayOf(PropTypes.shape({
      markId: PropTypes.string.isRequired,
      severity: PropTypes.string.isRequired,
    })).isRequired,
    onMarkClick: PropTypes.func.isRequired,
    onUndismissClick: PropTypes.func.isRequired,
    onDismissThisClick: PropTypes.func.isRequired,
    onDismissSameClick: PropTypes.func.isRequired,
  };

  getFilteredMarks() {
    const { actives } = this.props;
    return _.filter(this.props.marks, m => actives[m.dismissed ? "dismissed" : m.severity]);
  }

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
}
