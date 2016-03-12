"use strict";

import _ from "lodash";
import cutil from "../util/chrome-util";
import appConfig from "../app/app-config";
import linters from "./linters";
import messages from "./messages";

const BACKGROUND_COLORS = {
  passed: "#74D94F",
  info: "#A5E7FF",
  warning: "#FFF571",
  error: "#FF6E8D",
};

export default class Badge {
  constructor(appOptions) {
    this.appOptions = appOptions;
  }

  enable(tabId) {
    chrome.browserAction.enable(tabId);
  }

  disable(tabId) {
    chrome.browserAction.disable(tabId);
    this.hideLintCount(tabId);
  }

  activate(tabId) {
    chrome.browserAction.setIcon({ tabId: tabId, path: appConfig.activeIcon });
  }

  deactivate(tabId) {
    chrome.browserAction.setIcon({ tabId: tabId, path: appConfig.deactiveIcon });
  }

  toggleActive(tabId, active) {
    active ? this.activate(tabId) : this.deactivate(tabId);
  }

  showError(tabId) {
    this.deactivate(tabId);
    chrome.browserAction.setBadgeBackgroundColor({ tabId: tabId, color: "#F00" });
    chrome.browserAction.setBadgeText({ tabId: tabId, text: "Err" });
  }

  showLintCount(tabId, counts) {
    let maxSeverity = null;
    let sum = 0;
    _.each(this.appOptions.badgeCountSeverity, (sev) => {
      if (counts[sev] > 0 && !maxSeverity) maxSeverity = sev;
      sum += counts[sev];
    });

    chrome.browserAction.setBadgeText({
      tabId: tabId,
      text: sum > 0 ? sum.toString() : "OK",
    });
    chrome.browserAction.setBadgeBackgroundColor({
      tabId: tabId,
      color: BACKGROUND_COLORS[maxSeverity || "passed"],
    });
  }

  hideLintCount(tabId) {
    chrome.browserAction.setBadgeText({ tabId: tabId, text: "" });
  }

  updateForTabId(tabId) {
    cutil.withTab(tabId, (tab) => this.updateForTab(tab));
  }

  updateForActiveTab() {
    cutil.withActiveTab((tab) => this.updateForTab(tab));
  }

  updateForTab(tab) {
    if (!tab.url || !/^https?:/.test(tab.url)) {
      this.disable(tab.id);
      return;
    }
    this.enable(tab.id);

    const status = linters.getStatus(tab.id);
    if (status.lastError) {
      this.showError(tab.id);
      return;
    }

    messages.getStatus(tab.id).then(({active, marks, counts}) => {
      this.toggleActive(tab.id, active);

      const showCount = !_.isEmpty(this.appOptions.badgeCountSeverity);
      if (showCount && active && status.clientLinted && !status.waiting) {
        this.showLintCount(tab.id, counts);
      } else {
        this.hideLintCount(tab.id);
      }

      if (!active && linters.isActive(tab.id)) {
        linters.deactivate(tab.id);
      }
    }).catch((err) => {
      // Maybe not active
      this.deactivate(tab.id);
    });
  }
}
