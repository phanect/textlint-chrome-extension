/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React, { PropTypes } from "react";
import ErrorMessage from "./messages/error-message";
import LintingMessage from "./messages/linting-message";
import ReadyMessage from "./messages/ready-message";
import PassedMessage from "./messages/passed-message";
import HeaderPanel from "./header/header-panel";
import MarksPanel from "./marks/marks-panel";
import SettingsPanel from "./settings/settings-panel";

export default class PopupView extends React.Component {
  static propTypes = {
    controller: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    rulesets: PropTypes.arrayOf(PropTypes.object).isRequired,
    contentStatus: PropTypes.shape({
      active: PropTypes.bool.isRequired,
      undoCount: PropTypes.number.isRequired,
      counts: PropTypes.objectOf(PropTypes.number).isRequired,
      marks: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
    linterStatus: PropTypes.shape({
      active: PropTypes.bool.isRequired,
      waiting: PropTypes.bool.isRequired,
      clientLinted: PropTypes.bool.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      ruleset: this.props.settings.ruleset || this.props.settings.preset, /* Backward-compat */
      format: this.props.settings.format,
    };

    this.handleActivate = this.handleActivate.bind(this);
    this.handleDeactivate = this.handleDeactivate.bind(this);
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
  }

  handleActivate() {
    this.props.controller.activate(this.state);
  }
  handleDeactivate() {
    this.props.controller.deactivate();
  }
  handleSettingsChange(changes) {
    this.setState(changes);
  }
  handleUndo() {
    this.props.controller.undo();
  }

  renderContent() {
    const { controller, rulesets, contentStatus, linterStatus } = this.props;

    if (!contentStatus.active) {
      return (<SettingsPanel
        {...this.state}
        rulesets={rulesets}
        onChange={this.handleSettingsChange}
      />);
    }

    if (!linterStatus.active || linterStatus.waiting) {
      return <LintingMessage />;
    }
    if (!linterStatus.clientLinted) {
      return <ReadyMessage />;
    }
    if (contentStatus.marks.length === 0) {
      return <PassedMessage hasUndo={contentStatus.undoCount > 0} onUndo={this.handleUndo} />;
    }

    return (
      <MarksPanel
        controller={controller}
        counts={contentStatus.counts}
        marks={contentStatus.marks}
        hasUndo={contentStatus.undoCount > 0}
      />
    );
  }

  render() {
    const { controller, contentStatus, linterStatus } = this.props;

    if (linterStatus.lastError) {
      return <ErrorMessage reason={linterStatus.lastError} />;
    }

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
  }
}
