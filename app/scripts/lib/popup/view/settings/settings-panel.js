/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import React, { PropTypes } from "react";
import { translate } from "@io-monad/chrome-util";
import RulesetList from "./ruleset-list";
import FormatSelect from "./format-select";

export default class SettingsPanel extends React.Component {
  static propTypes = {
    rulesets: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
    })).isRequired,
    ruleset: PropTypes.string,
    format: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleRulesetSelect = this.handleRulesetSelect.bind(this);
    this.handleFormatSelect = this.handleFormatSelect.bind(this);
  }

  handleRulesetSelect(rulesetName) {
    this.props.onChange({ ruleset: rulesetName });
  }
  handleFormatSelect(formatName) {
    this.props.onChange({ format: formatName });
  }

  render() {
    const { rulesets, ruleset, format } = this.props;
    return (
      <div className="settings-panel">
        <p>{translate("chooseRuleset")}</p>
        <form>
          <RulesetList
            rulesets={rulesets} selected={ruleset}
            onRulesetSelect={this.handleRulesetSelect}
          />
          <FormatSelect
            selected={format}
            onFormatSelect={this.handleFormatSelect}
          />
        </form>
      </div>
    );
  }
}
