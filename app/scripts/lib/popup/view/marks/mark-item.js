/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import $ from "jquery";
import React, { PropTypes } from "react";
import { translate } from "../../../util/chrome-util";
import bundles from "../../../app/bundles";
import DismissButton from "./dismiss-button";
import UndismissButton from "./undismiss-button";

export default class MarkItem extends React.Component {
  static propTypes = {
    mark: PropTypes.shape({
      severity: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      correctable: PropTypes.bool.isRequired,
      dismissed: PropTypes.bool.isRequired,
      ruleId: PropTypes.string.isRequired,
    }).isRequired,
    onMarkClick: PropTypes.func.isRequired,
    onUndismissClick: PropTypes.func.isRequired,
    onDismissThisClick: PropTypes.func.isRequired,
    onDismissSameClick: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleMarkClick = this.handleMarkClick.bind(this);
  }

  getRuleHomepage() {
    const rule = bundles.get(this.props.mark.ruleId);
    return rule && rule.homepage;
  }

  handleMarkClick(e) {
    if ($(e.target).parents(".mark-item-menu").length > 0) return;
    this.props.onMarkClick(e);
  }

  render() {
    const { mark } = this.props;
    const ruleHomepage = this.getRuleHomepage();
    const severityClass = mark.dismissed ? "dismissed" : mark.severity;
    return (
      <div
        className={`mark-item mark-item-${severityClass} clearfix`}
        onClick={this.handleMarkClick}
      >
        <div className="mark-item-text">
          <i className={`mark-item-severity icon-${severityClass}`}></i>
          {mark.correctable ?
            <i className="mark-item-correctable fa fa-check" title={translate("correctable")}></i>
            : ""
          }
          <span className="mark-item-message">{mark.message}</span>
        </div>
        <div className="mark-item-menu">
          <a
            href={ruleHomepage || "#"}
            className="mark-item-menu-item"
            title={mark.ruleId}
            target="_blank"
          >
            <i className="fa fa-home"></i>
          </a>
          {mark.dismissed ? (
            <UndismissButton
              onClick={this.props.onUndismissClick}
            />
          ) : (
            <DismissButton
              onDismissThisClick={this.props.onDismissThisClick}
              onDismissSameClick={this.props.onDismissSameClick}
            />
          )}
        </div>
      </div>
    );
  }
}
