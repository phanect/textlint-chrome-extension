/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import {translate} from "../../../util/chrome-util";

const FormatSelect = React.createClass({
  propTypes: {
    selected: React.PropTypes.string.isRequired,
    onFormatSelect: React.PropTypes.func.isRequired,
  },
  render() {
    const {selected, onFormatSelect} = this.props;
    return (
      <div className="format-select">
        <label className="checkbox">
          <input type="checkbox" name="format" value="md"
            defaultChecked={selected === "md"}
            onChange={(e) => onFormatSelect(e.target.checked ? "md" : "txt")}
          />
          <span>{translate("checkAsMarkdown")}</span>
        </label>
      </div>
    );
  }
});

export default FormatSelect;
