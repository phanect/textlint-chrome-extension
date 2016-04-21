/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React, { PropTypes } from "react";
import { translate } from "../../../util/chrome-util";

export default class MessageBox extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    details: PropTypes.string,
    mark: PropTypes.string.isRequired,
    spin: PropTypes.bool,
    children: PropTypes.element,
  };

  render() {
    const { text, details, mark, spin } = this.props;
    return (
      <div className={`message-box ${text}-message`}>
        <i className={`message-mark fa fa-${mark} ${spin ? "fa-spin" : ""}`}></i>
        <p className="message-text">{translate(text)}</p>
        {details ? <p className="message-details">{details}</p> : ""}
        {this.props.children}
      </div>
    );
  }
}
