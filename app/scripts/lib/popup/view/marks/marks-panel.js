/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import _ from "lodash";
import React, { PropTypes } from "react";
import FilterList from "./filter-list";
import MarkList from "./mark-list";
import CorrectButtons from "./correct-buttons";

export default class MarksPanel extends React.Component {
  static propTypes = {
    controller: PropTypes.any.isRequired,
    counts: PropTypes.objectOf(PropTypes.number).isRequired,
    marks: PropTypes.arrayOf(PropTypes.shape({
      correctable: PropTypes.bool.isRequired,
    })).isRequired,
    hasUndo: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      actives: { error: true, warning: true, info: true },
    };

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleUndoClick = this.handleUndoClick.bind(this);
    this.handleCorrectClick = this.handleCorrectClick.bind(this);
    this.handleMarkClick = this.handleMarkClick.bind(this);
    this.handleUndismissClick = this.handleUndismissClick.bind(this);
    this.handleDismissThisClick = this.handleDismissThisClick.bind(this);
    this.handleDismissSameClick = this.handleDismissSameClick.bind(this);
  }

  handleFilterChange(severity, active) {
    const newActives = _.defaults({ [severity]: active }, this.state.actives);
    this.setState({ actives: newActives });
  }
  handleUndoClick() {
    this.props.controller.undo();
  }
  handleCorrectClick() {
    this.props.controller.correct();
  }
  handleMarkClick(markId) {
    this.props.controller.showMark(markId);
  }
  handleUndismissClick(markId) {
    this.props.controller.undismissMark(markId);
  }
  handleDismissThisClick(markId) {
    this.props.controller.dismissThisMark(markId);
  }
  handleDismissSameClick(markId) {
    this.props.controller.dismissSameMarks(markId);
  }

  render() {
    const { counts, marks, hasUndo } = this.props;
    const { actives } = this.state;
    return (
      <div className="marks-panel">
        <div className="marks-panel-header clearfix">
          <FilterList
            counts={counts} actives={actives}
            onFilterChange={this.handleFilterChange}
          />
          <CorrectButtons
            marks={marks} hasUndo={hasUndo}
            onUndoClick={this.handleUndoClick}
            onCorrectClick={this.handleCorrectClick}
          />
        </div>
        <MarkList
          actives={actives} marks={marks}
          onMarkClick={this.handleMarkClick}
          onUndismissClick={this.handleUndismissClick}
          onDismissThisClick={this.handleDismissThisClick}
          onDismissSameClick={this.handleDismissSameClick}
        />
      </div>
    );
  }
}
