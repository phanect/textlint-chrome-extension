/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import React from "react";
import FilterList from "./filter-list";
import MarkList from "./mark-list";
import CorrectButtons from "./correct-buttons";

const MarksPanel = React.createClass({
  propTypes: {
    controller: React.PropTypes.any.isRequired,
    counts: React.PropTypes.objectOf(React.PropTypes.number).isRequired,
    marks: React.PropTypes.arrayOf(React.PropTypes.shape({
      correctable: React.PropTypes.bool.isRequired,
    })).isRequired,
    hasUndo: React.PropTypes.bool.isRequired,
  },
  getInitialState() {
    return {
      actives: { error: true, warning: true, info: true },
    };
  },
  handleFilterChange(severity, active) {
    const newActives = _.defaults({ [severity]: active }, this.state.actives);
    this.setState({ actives: newActives });
  },
  handleUndoClick() {
    this.props.controller.undo();
  },
  handleCorrectClick() {
    this.props.controller.correct();
  },
  handleMarkClick(markId) {
    this.props.controller.showMark(markId);
  },
  handleUndismissClick(markId) {
    this.props.controller.undismissMark(markId);
  },
  handleDismissThisClick(markId) {
    this.props.controller.dismissThisMark(markId);
  },
  handleDismissSameClick(markId) {
    this.props.controller.dismissSameMarks(markId);
  },
  render() {
    const { counts, marks, hasUndo } = this.props;
    const { actives } = this.state;
    return (
      <div className="marks-panel">
        <div className="marks-panel-header clearfix">
          <FilterList counts={counts} actives={actives}
            onFilterChange={this.handleFilterChange}
          />
          <CorrectButtons marks={marks} hasUndo={hasUndo}
            onUndoClick={this.handleUndoClick}
            onCorrectClick={this.handleCorrectClick}
          />
        </div>
        <MarkList actives={actives} marks={marks}
          onMarkClick={this.handleMarkClick}
          onUndismissClick={this.handleUndismissClick}
          onDismissThisClick={this.handleDismissThisClick}
          onDismissSameClick={this.handleDismissSameClick}
        />
      </div>
    );
  },
});

export default MarksPanel;
