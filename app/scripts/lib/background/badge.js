/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import cutil from "../util/chrome-util";
import appConfig from "../app/app-config";
import linters from "./linters";
import messages from "./messages";

const BACKGROUND_COLORS = {
  passed: "#74D94F",
  info: "#5DB1FF",
  warning: "#FFC31B",
  error: "#FF355A",
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
    chrome.browserAction.setIcon({ tabId, path: appConfig.activeIcon });
  }

  deactivate(tabId) {
    chrome.browserAction.setIcon({ tabId, path: appConfig.deactiveIcon });
  }

  toggleActive(tabId, active) {
    if (active) {
      this.activate(tabId);
    } else {
      this.deactivate(tabId);
    }
  }

  showError(tabId) {
    this.deactivate(tabId);
    chrome.browserAction.setBadgeBackgroundColor({ tabId, color: "#F00" });
    chrome.browserAction.setBadgeText({ tabId, text: "Err" });
  }

  showLintCount(tabId, counts) {
    let maxSeverity = null;
    let sum = 0;
    _.each(this.appOptions.badgeCountSeverity, (sev) => {
      if (counts[sev] > 0 && !maxSeverity) maxSeverity = sev;
      sum += counts[sev];
    });

    chrome.browserAction.setBadgeText({
      tabId,
      text: sum > 0 ? sum.toString() : "OK",
    });
    chrome.browserAction.setBadgeBackgroundColor({
      tabId,
      color: BACKGROUND_COLORS[maxSeverity || "passed"],
    });
  }

  hideLintCount(tabId) {
    chrome.browserAction.setBadgeText({ tabId, text: "" });
  }

  updateForTabId(tabId) {
    return new Promise((resolve, reject) => {
      cutil.withTab(tabId, (tab) => {
        this.updateForTab(tab).then(resolve, reject);
      });
    });
  }

  updateForActiveTab() {
    return new Promise((resolve, reject) => {
      cutil.withActiveTab((tab) => {
        this.updateForTab(tab).then(resolve, reject);
      });
    });
  }

  updateForTab(tab) {
    return new Promise((resolve) => {
      if (!tab.url || !/^https?:/.test(tab.url)) {
        this.disable(tab.id);
        resolve();
        return;
      }
      this.enable(tab.id);

      const status = linters.getStatus(tab.id);
      if (status.lastError) {
        this.showError(tab.id);
        resolve();
        return;
      }

      messages.getStatus(tab.id).then(({ active, counts }) => {
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
        resolve();
      }).catch(() => {
        // Maybe not active
        this.deactivate(tab.id);
        resolve();
      });
    });
  }
}
