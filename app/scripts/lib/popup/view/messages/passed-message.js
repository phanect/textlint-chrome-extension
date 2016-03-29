/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import MessageBox from "../common/message-box";
import IconButton from "../common/icon-button";

const PassedMessage = React.createClass({
  propTypes: {
    hasUndo: React.PropTypes.bool.isRequired,
    onUndo: React.PropTypes.func.isRequired,
  },
  render() {
    const { hasUndo, onUndo } = this.props;
    return (
      <MessageBox text="passed" mark="check-circle">
        {hasUndo ?
          <IconButton label="undo" icon="undo" onClick={onUndo} />
        : ""}
      </MessageBox>
    );
  },
});

export default PassedMessage;
