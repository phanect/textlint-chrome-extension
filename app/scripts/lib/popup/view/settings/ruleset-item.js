/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import {translate} from "../../../util/chrome-util";

const RulesetItem = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    selected: React.PropTypes.bool.isRequired,
    onClick: React.PropTypes.func.isRequired,
  },
  render() {
    const {name, selected, onClick} = this.props;
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
});

export default RulesetItem;
