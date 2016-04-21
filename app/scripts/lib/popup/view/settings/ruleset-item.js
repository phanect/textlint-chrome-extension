/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import React, { PropTypes } from "react";
import { translate } from "../../../util/chrome-util";

export default class RulesetItem extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    const { name, selected, onClick } = this.props;
    return (
      <div className="ruleset-item radio">
        <label>
          <input className="ruleset-item-radio" type="radio" name="ruleset"
            value={name} defaultChecked={selected} onChange={onClick}
          />
          <span className="ruleset-item-name">
            {translate(`ruleset-${name}`)}
          </span>
        </label>
      </div>
    );
  }
}
