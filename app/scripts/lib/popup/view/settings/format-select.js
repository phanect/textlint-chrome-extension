/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import React, { PropTypes } from "react";
import { translate } from "../../../util/chrome-util";

export default class FormatSelect extends React.Component {
  static propTypes = {
    selected: PropTypes.string.isRequired,
    onFormatSelect: PropTypes.func.isRequired,
  };

  render() {
    const { selected, onFormatSelect } = this.props;
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
}
