/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import React, { PropTypes } from "react";
import { translate } from "@io-monad/chrome-util";
import SeveritySwitch from "./severity-switch";
import RuleToggle from "./rule-toggle";
import RuleEditor from "./rule-editor";

export default class RuleItem extends React.Component {
  static propTypes = {
    rule: PropTypes.shape({
      key: PropTypes.string.isRequired,
      schema: PropTypes.object.isRequired,
      options: PropTypes.any,
      description: PropTypes.string.isRequired,
      version: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      homepage: PropTypes.string.isRequired,
    }).isRequired,
    enabled: PropTypes.bool.isRequired,
    severity: PropTypes.string.isRequired,
    filtered: PropTypes.bool.isRequired,
    onSeveritySelect: PropTypes.func.isRequired,
    onEnabledChange: PropTypes.func.isRequired,
    onEditorReady: PropTypes.func.isRequired,
  };

  render() {
    const { rule, enabled, severity, filtered } = this.props;
    const className = [
      "rule-item",
      filtered ? "filtered" : "",
      !enabled ? "disabled" : "",
    ].join(" ");
    return (
      <form className={className} id={`rule-item-${rule.key}`}>
        <div className="rule-item-header clearfix">
          <div className="rule-item-switch">
            <SeveritySwitch selected={severity} onSelect={this.props.onSeveritySelect} />
            <RuleToggle enabled={enabled} onChange={this.props.onEnabledChange} />
          </div>
          <div className="rule-item-title">
            <a className="rule-item-name" href={rule.homepage} target="_blank">
              {rule.key}
            </a>
            <span className="rule-item-version">{rule.version}</span>
            <span className="rule-item-author">by {rule.author}</span>
            <a className="rule-item-homepage" href={rule.homepage} target="_blank">
              <i className="fa fa-home"></i>
            </a>
          </div>
        </div>
        <div className="rule-item-body">
          <div className="rule-item-description"
            dangerouslySetInnerHTML={{
              __html: translate(`rule-${rule.key}-description`, rule.description),
            }}
          ></div>
          <div className="rule-item-options">
            <RuleEditor
              rule={rule}
              onReady={this.props.onEditorReady}
            />
          </div>
        </div>
      </form>
    );
  }
}
