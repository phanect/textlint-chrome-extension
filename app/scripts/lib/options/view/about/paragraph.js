/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import {translate} from "../../../util/chrome-util";

const Pargraph = React.createClass({
  propTypes: {
    text: React.PropTypes.string.isRequired,
  },
  render() {
    return (
      <p dangerouslySetInnerHTML={{ __html: translate(this.props.text) }}></p>
    );
  }
});

export default Pargraph;
