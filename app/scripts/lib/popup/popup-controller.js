/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import React from "react";
import ReactDOM from "react-dom";
import messages from "../background/messages";
import appConfig from "../app/app-config";
import DismissType from "../content/dismiss-type";
import cutil from "../util/chrome-util";
import PopupSettings from "./popup-settings";
import PopupView from "./view/popup-view";
import RefreshMessage from "./view/messages/refresh-message";
import ErrorMessage from "./view/messages/error-message";

export default class PopupController {
  constructor() {
    this.container = document.getElementById("container");
    this.lastError = null;
    this.settings = null;
    this.contentStatus = null;
    this.linterStatus = null;
    this.gotError = this.gotError.bind(this);
  }

  start() {
    this.bindMessageEvents();

    PopupSettings.load().then((settings) => {
      this.settings = settings;
      this.updateViewForActiveTab();
    }).catch(this.gotError);
  }

  gotError(err) {
    console.error("Got error", err);
    const requireUpdate = !!this.lastError;
    this.lastError = (err && err.message) || err;
    if (requireUpdate) this.updateViewForActiveTab();
  }

  bindMessageEvents() {
    messages.onError((reason) => {
      this.showRefreshMessage();
    });
    messages.onUpdateStatus((msg, sender, sendResponse) => {
      if (sender.tab) this.updateViewForTab(sender.tab);
      sendResponse();
    });
  }

  updateViewForActiveTab() {
    cutil.withActiveTab((tab) => this.updateViewForTab(tab));
  }

  updateViewForTab(tab) {
    const tabId = tab.id ? tab.id : tab;

    if (!this.settings) {
      return;  // Not ready
    }
    if (this.lastError) {
      return ReactDOM.render(<ErrorMessage reason={this.lastError} />, this.container);
    }

    this.withLinters((linters) => {
      messages.getStatus(tabId).then((contentStatus) => {
        const linterStatus = linters.getStatus(tabId);
        this.renderView(contentStatus, linterStatus);
      }).catch((err) => {
        console.error(err);
        this.showRefreshMessage();
      });
    });
  }

  renderView(contentStatus, linterStatus) {
    ReactDOM.render(
      <PopupView
        controller={this}
        settings={this.settings}
        rulesets={appConfig.rulesets}
        contentStatus={contentStatus}
        linterStatus={linterStatus}
      />,
      this.container
    );
  }

  showRefreshMessage() {
    ReactDOM.render(
      <RefreshMessage onRefresh={() => this.refreshPage()} />,
      this.container
    );
  }

  activate(settings) {
    this.settings.overwrite(settings);
    this.settings.save().then(() => {
      this.withLinters((linters) => {
        cutil.withActiveTab((tab) => {
          linters.activate(tab.id, this.settings.ruleset, this.settings.format);
        });
      });
    }).catch(this.gotError);
  }

  deactivate() {
    this.withLinters((linters) => {
      cutil.withActiveTab((tab) => {
        linters.deactivate(tab.id);
      });
    });
  }

  correct() {
    cutil.withActiveTab((tab) => {
      messages.triggerCorrect(tab.id);
    });
  }

  undo() {
    cutil.withActiveTab((tab) => {
      messages.undo(tab.id);
    });
  }

  showMark(markId) {
    cutil.withActiveTab((tab) => {
      messages.showMark(tab.id, markId);
    });
  }

  dismissThisMark(markId) {
    cutil.withActiveTab((tab) => {
      messages.dismissMark(tab.id, markId, DismissType.ONLY_THIS);
    });
  }

  dismissSameMarks(markId) {
    cutil.withActiveTab((tab) => {
      messages.dismissMark(tab.id, markId, DismissType.ALL_SAME);
    });
  }

  undismissMark(markId) {
    cutil.withActiveTab((tab) => {
      messages.dismissMark(tab.id, markId, DismissType.UNDISMISS);
    });
  }

  refreshPage() {
    cutil.withActiveTab((tab) => {
      chrome.tabs.reload(tab.id);
    });
  }

  withLinters(fn) {
    chrome.runtime.getBackgroundPage((background) => {
      fn(background.linters);
    });
  }
}
