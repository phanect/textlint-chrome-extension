/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React, { PropTypes } from "react";
import MessageBox from "../common/message-box";

export default class ErrorMessage extends React.Component {
  static propTypes = {
    reason: PropTypes.string,
  };

  render() {
    const { reason } = this.props;
    const details = DEBUG ? reason : null;
    return (
      <MessageBox text="wentWrong" details={details} mark="exclamation-triangle" />
    );
  }
}
