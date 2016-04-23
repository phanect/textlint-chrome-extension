/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import React from "react";
import IconButton from "../common/icon-button";
import { openOptionsPage } from "@io-monad/chrome-util";

export default class OptionsButton extends React.Component {
  render() {
    return (
      <IconButton icon="cog" label="options" onClick={openOptionsPage} />
    );
  }
}
