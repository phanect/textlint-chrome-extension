/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import _ from "lodash";
import React, { PropTypes } from "react";
import { translate } from "@io-monad/chrome-util";
import RuleListFilter from "./rule-list-filter";
import RuleListToggle from "./rule-list-toggle";
import RuleItem from "./rule-item";

export default class RuleList extends React.Component {
  static propTypes = {
    rules: PropTypes.arrayOf(PropTypes.object).isRequired,
    onEditorReady: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const ruleMap = _.keyBy(this.props.rules, "key");
    this.state = {
      rulesFiltered: _.mapValues(ruleMap, _.constant(false)),
      rulesEnabled: _.mapValues(ruleMap, "enabled"),
      rulesSeverity: _.mapValues(ruleMap, "severity"),
    };

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleTurnOnClick = this.handleTurnOnClick.bind(this);
    this.handleTurnOffClick = this.handleTurnOffClick.bind(this);
    this.handleSeveritySelect = this.handleSeveritySelect.bind(this);
    this.handleEnabledChange = this.handleEnabledChange.bind(this);
  }

  getRuleSeverity(rule) {
    return this.state.rulesSeverity[rule.key ? rule.key : rule];
  }
  isRuleEnabled(rule) {
    return this.state.rulesEnabled[rule.key ? rule.key : rule];
  }

  handleFilterChange(filter) {
    const match = filter ? (rule) =>
      filter.test(rule.key) || filter.test(rule.author) || filter.test(rule.description) ||
      filter.test(translate(`rule-${rule.key}-description`, ""))
    : _.constant(true);

    const newFiltered = _.reduce(this.props.rules, (a, r) => (a[r.key] = !match(r), a), {});
    this.setState({ rulesFiltered: newFiltered });
  }
  handleTurnOnClick() {
    const newEnabled = _.mapValues(this.state.rulesEnabled, _.constant(true));
    this.setState({ rulesEnabled: newEnabled });
  }
  handleTurnOffClick() {
    const newEnabled = _.mapValues(this.state.rulesEnabled, _.constant(false));
    this.setState({ rulesEnabled: newEnabled });
  }
  handleSeveritySelect(key, severity) {
    const newSeverity = _.defaults({ [key]: severity }, this.state.rulesSeverity);
    this.setState({ rulesSeverity: newSeverity });
  }
  handleEnabledChange(key, enabled) {
    const newEnabled = _.defaults({ [key]: enabled }, this.state.rulesEnabled);
    this.setState({ rulesEnabled: newEnabled });
  }

  render() {
    const { rules } = this.props;
    const { rulesFiltered, rulesEnabled, rulesSeverity } = this.state;
    return (
      <div className="rule-list">
        <div className="rule-list-header clearfix">
          <RuleListFilter onFilterChange={this.handleFilterChange} />
          <RuleListToggle
            onTurnOnClick={this.handleTurnOnClick}
            onTurnOffClick={this.handleTurnOffClick}
          />
        </div>
        <div className="rule-list-items f16">
          {rules.map(rule =>
            <RuleItem
              key={rule.key}
              rule={rule}
              filtered={rulesFiltered[rule.key]}
              enabled={rulesEnabled[rule.key]}
              severity={rulesSeverity[rule.key]}
              onSeveritySelect={(severity) => this.handleSeveritySelect(rule.key, severity)}
              onEnabledChange={(enabled) => this.handleEnabledChange(rule.key, enabled)}
              onEditorReady={(editor) => this.props.onEditorReady(rule.key, editor)}
            />
          )}
        </div>
      </div>
    );
  }
}
