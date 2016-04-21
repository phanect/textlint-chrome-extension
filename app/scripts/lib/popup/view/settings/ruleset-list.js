/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import React, { PropTypes } from "react";
import RulesetItem from "./ruleset-item";

export default class RulesetList extends React.Component {
  static propTypes = {
    rulesets: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
    })).isRequired,
    selected: PropTypes.string.isRequired,
    onRulesetSelect: PropTypes.func.isRequired,
  };

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
  }
}
