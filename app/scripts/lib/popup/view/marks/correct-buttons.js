/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import React from "react";
import IconButton from "../common/icon-button";

const CorrectButtons = React.createClass({
  propTypes: {
    marks: React.PropTypes.arrayOf(React.PropTypes.shape({
      correctable: React.PropTypes.bool.isRequired,
    })).isRequired,
    hasUndo: React.PropTypes.bool.isRequired,
    onUndoClick: React.PropTypes.func.isRequired,
    onCorrectClick: React.PropTypes.func.isRequired,
  },
  render() {
    const {marks, hasUndo, onUndoClick, onCorrectClick} = this.props;
    return (
      <div className="correct-buttons">
        {hasUndo ?
          <IconButton label="undo" icon="undo" size="sm"
            onClick={onUndoClick} />
        : ""}
        {_.some(marks, "correctable") ?
          <IconButton label="correct" icon="check-circle" btn="success" size="sm"
            onClick={onCorrectClick} />
        : ""}
      </div>
    );
  }
});

export default CorrectButtons;
