/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import IconButton from "../common/icon-button";
import cutil from "../../../util/chrome-util";

const OptionsButton = React.createClass({
  handleClick() {
    cutil.openOptionsPage();
  },
  render() {
    return (
      <IconButton icon="cog" label="options" onClick={this.handleClick} />
    );
  },
});

export default OptionsButton;
