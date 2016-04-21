/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React, { PropTypes } from "react";
import MessageBox from "../common/message-box";
import IconButton from "../common/icon-button";

export default class PassedMessage extends React.Component {
  static propTypes = {
    hasUndo: PropTypes.bool.isRequired,
    onUndo: PropTypes.func.isRequired,
  };

  render() {
    const { hasUndo, onUndo } = this.props;
    return (
      <MessageBox text="passed" mark="check-circle">
        {hasUndo ?
          <IconButton label="undo" icon="undo" onClick={onUndo} />
        : ""}
      </MessageBox>
    );
  }
}
