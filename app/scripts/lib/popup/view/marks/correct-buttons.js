/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import React, { PropTypes } from "react";
import IconButton from "../common/icon-button";

export default class CorrectButtons extends React.Component {
  static propTypes = {
    marks: PropTypes.arrayOf(PropTypes.shape({
      correctable: PropTypes.bool.isRequired,
    })).isRequired,
    hasUndo: PropTypes.bool.isRequired,
    onUndoClick: PropTypes.func.isRequired,
    onCorrectClick: PropTypes.func.isRequired,
  };

  render() {
    const { marks, hasUndo, onUndoClick, onCorrectClick } = this.props;
    return (
      <div className="correct-buttons">
        {hasUndo ?
          <IconButton label="undo" icon="undo" size="sm"
            onClick={onUndoClick}
          />
        : ""}
        {_.some(marks, "correctable") ?
          <IconButton label="correct" icon="check-circle" btn="success" size="sm"
            onClick={onCorrectClick}
          />
        : ""}
      </div>
    );
  }
}
