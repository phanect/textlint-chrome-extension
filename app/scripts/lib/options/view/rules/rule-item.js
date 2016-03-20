/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import {translate} from "../../../util/chrome-util";
import SeveritySwitch from "./severity-switch";
import RuleToggle from "./rule-toggle";
import RuleEditor from "./rule-editor";

const RuleItem = React.createClass({
  propTypes: {
    rule: React.PropTypes.shape({
      key: React.PropTypes.string.isRequired,
      schema: React.PropTypes.object.isRequired,
      options: React.PropTypes.any,
      description: React.PropTypes.string.isRequired,
      version: React.PropTypes.string.isRequired,
      author: React.PropTypes.string.isRequired,
      homepage: React.PropTypes.string.isRequired,
    }).isRequired,
    enabled: React.PropTypes.bool.isRequired,
    severity: React.PropTypes.string.isRequired,
    filtered: React.PropTypes.bool.isRequired,
    onSeveritySelect: React.PropTypes.func.isRequired,
    onEnabledChange: React.PropTypes.func.isRequired,
    onEditorReady: React.PropTypes.func.isRequired,
  },
  render() {
    const {rule, enabled, severity, filtered} = this.props;
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
              __html: translate(`rule-${rule.key}-description`, rule.description)
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
});

export default RuleItem;
