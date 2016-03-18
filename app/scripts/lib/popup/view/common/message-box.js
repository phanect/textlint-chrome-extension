/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import {translate} from "../../../util/chrome-util";

const MessageBox = React.createClass({
  propTypes: {
    text: React.PropTypes.string.isRequired,
    details: React.PropTypes.string,
    mark: React.PropTypes.string.isRequired,
    spin: React.PropTypes.bool,
    children: React.PropTypes.element,
  },
  render() {
    const {text, details, mark, spin} = this.props;
    return (
      <div className={`message-box ${text}-message`}>
        <i className={`message-mark fa fa-${mark} ${spin ? "fa-spin" : ""}`}></i>
        <p className="message-text">{translate(text)}</p>
        {details ? <p className="message-details">{details}</p> : ""}
        {this.props.children}
      </div>
    );
  }
});

export default MessageBox;
