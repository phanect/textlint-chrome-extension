/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import ErrorMessage from "./messages/error-message";
import LintingMessage from "./messages/linting-message";
import ReadyMessage from "./messages/ready-message";
import PassedMessage from "./messages/passed-message";
import HeaderPanel from "./header/header-panel";
import MarksPanel from "./marks/marks-panel";
import SettingsPanel from "./settings/settings-panel";

const PopupView = React.createClass({
  propTypes: {
    controller: React.PropTypes.object.isRequired,
    settings: React.PropTypes.object.isRequired,
    rulesets: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    contentStatus: React.PropTypes.shape({
      active: React.PropTypes.bool.isRequired,
      undoCount: React.PropTypes.number.isRequired,
      counts: React.PropTypes.objectOf(React.PropTypes.number).isRequired,
      marks: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    }).isRequired,
    linterStatus: React.PropTypes.shape({
      active: React.PropTypes.bool.isRequired,
      waiting: React.PropTypes.bool.isRequired,
      clientLinted: React.PropTypes.bool.isRequired,
    }).isRequired,
  },
  getInitialState() {
    return {
      ruleset: this.props.settings.ruleset || this.props.settings.preset, /* Backward-compat */
      format: this.props.settings.format,
    };
  },
  handleActivate() {
    this.props.controller.activate(this.state);
  },
  handleDeactivate() {
    this.props.controller.deactivate();
  },
  handleSettingsChange(changes) {
    this.setState(changes);
  },
  handleUndo() {
    this.props.controller.undo();
  },
  render() {
    const {controller, contentStatus, linterStatus} = this.props;

    if (linterStatus.lastError)
      return <ErrorMessage reason={linterStatus.lastError} />;

    return (
      <div className="popup-view">
        <HeaderPanel
          controller={controller}
          active={contentStatus.active}
          onActivate={this.handleActivate}
          onDeactivate={this.handleDeactivate}
        />
        {this.renderContent()}
      </div>
    );
  },
  renderContent() {
    const {controller, settings, rulesets, contentStatus, linterStatus} = this.props;

    if (!contentStatus.active) {
      return <SettingsPanel
        {...this.state}
        rulesets={rulesets}
        onChange={this.handleSettingsChange}
      />;
    }

    if (!linterStatus.active || linterStatus.waiting)
      return <LintingMessage />;
    if (!linterStatus.clientLinted)
      return <ReadyMessage />;
    if (contentStatus.marks.length === 0)
      return <PassedMessage hasUndo={contentStatus.undoCount > 0} onUndo={this.handleUndo} />;

    return (
      <MarksPanel
        controller={controller}
        counts={contentStatus.counts}
        marks={contentStatus.marks}
        hasUndo={contentStatus.undoCount > 0}
      />
    );
  }
});

export default PopupView;
