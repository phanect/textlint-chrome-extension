/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import RulesetItem from "./ruleset-item";

const RulesetList = React.createClass({
  propTypes: {
    rulesets: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
    })).isRequired,
    selected: React.PropTypes.string.isRequired,
    onRulesetSelect: React.PropTypes.func.isRequired,
  },
  render() {
    const { rulesets, selected, onRulesetSelect } = this.props;
    return (
      <div className="ruleset-list">
        {rulesets.map(ruleset =>
          <RulesetItem
            key={ruleset.name}
            {...ruleset}
            selected={selected === ruleset.name}
            onClick={() => onRulesetSelect(ruleset.name)}
          />
        )}
      </div>
    );
  },
});

export default RulesetList;
