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
    settings: React.PropTypes.shape({
      ruleset: React.PropTypes.string,
      format: React.PropTypes.string,
    }).isRequired,
  },
  getInitialState() {
    return {
      selectedRuleset: this.props.settings.ruleset,
      selectedFormat: this.props.settings.format,
    };
  },
  handleRulesetSelect(rulesetName) {
    this.props.settings.ruleset = rulesetName;
    this.setState({ selectedRuleset: rulesetName });
  },
  handleFormatSelect(formatName) {
    this.props.settings.format = formatName;
    this.setState({ selectedFormat: formatName });
  },
  render() {
    const {rulesets} = this.props;
    const {selectedRuleset, selectedFormat} = this.state;
    return (
      <div className="settings-panel">
        <p>{translate("chooseRuleset")}</p>
        <form>
          <RulesetList rulesets={rulesets} selected={selectedRuleset}
            onRulesetSelect={this.handleRulesetSelect} />
          <FormatSelect selected={selectedFormat}
            onFormatSelect={this.handleFormatSelect} />
        </form>
      </div>
    );
  }
});

export default SettingsPanel;
