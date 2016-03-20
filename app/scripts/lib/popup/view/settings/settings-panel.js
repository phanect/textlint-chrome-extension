/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import {translate} from "../../../util/chrome-util";
import RulesetList from "./ruleset-list";
import FormatSelect from "./format-select";

const SettingsPanel = React.createClass({
  propTypes: {
    rulesets: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
    })).isRequired,
    ruleset: React.PropTypes.string,
    format: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
  },
  handleRulesetSelect(rulesetName) {
    this.props.onChange({ ruleset: rulesetName });
  },
  handleFormatSelect(formatName) {
    this.props.onChange({ format: formatName });
  },
  render() {
    const {rulesets, ruleset, format} = this.props;
    return (
      <div className="settings-panel">
        <p>{translate("chooseRuleset")}</p>
        <form>
          <RulesetList rulesets={rulesets} selected={ruleset}
            onRulesetSelect={this.handleRulesetSelect} />
          <FormatSelect selected={format}
            onFormatSelect={this.handleFormatSelect} />
        </form>
      </div>
    );
  }
});

export default SettingsPanel;
