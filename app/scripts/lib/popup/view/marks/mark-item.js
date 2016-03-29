/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import $ from "jquery";
import React from "react";
import { translate } from "../../../util/chrome-util";
import bundles from "../../../app/bundles";

const MarkItem = React.createClass({
  propTypes: {
    mark: React.PropTypes.shape({
      severity: React.PropTypes.string.isRequired,
      message: React.PropTypes.string.isRequired,
      correctable: React.PropTypes.bool.isRequired,
      dismissed: React.PropTypes.bool.isRequired,
      ruleId: React.PropTypes.string.isRequired,
    }).isRequired,
    onMarkClick: React.PropTypes.func.isRequired,
    onUndismissClick: React.PropTypes.func.isRequired,
    onDismissThisClick: React.PropTypes.func.isRequired,
    onDismissSameClick: React.PropTypes.func.isRequired,
  },
  getRuleHomepage() {
    const rule = bundles.get(this.props.mark.ruleId);
    return rule && rule.homepage;
  },
  handleMarkClick(e) {
    if ($(e.target).parents(".mark-item-menu").length > 0) return;
    this.props.onMarkClick(e);
  },
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
  },
});

const UndismissButton = (props) => (
  <a href="#" className="mark-item-menu-item mark-undismiss"
    title={translate("undismissIt")} onClick={props.onClick}
  >
    <i className="fa fa-bell"></i>
  </a>
);
UndismissButton.propTypes = {
  onClick: React.PropTypes.func.isRequired,
};

const DismissButton = (props) => (
  <div className="btn-group mark-dismiss">
    <a href="#" className="mark-item-menu-item" title={translate("dismissIt")}
      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
    >
      <i className="fa fa-bell-slash"></i>
    </a>
    <ul className="dropdown-menu dropdown-menu-right">
      <li>
        <a href="#" className="mark-dismiss-this" onClick={props.onDismissThisClick}>
          {translate("dismissOnlyThis")}
        </a>
      </li>
      <li>
        <a href="#" className="mark-dismiss-same" onClick={props.onDismissSameClick}>
          {translate("dismissAllSame")}
        </a>
      </li>
    </ul>
  </div>
);
DismissButton.propTypes = {
  onDismissThisClick: React.PropTypes.func.isRequired,
  onDismissSameClick: React.PropTypes.func.isRequired,
};

export default MarkItem;
