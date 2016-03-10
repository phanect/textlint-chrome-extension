"use strict";

import _ from "lodash";
import cutil from "../util/chrome-util";
import appConfig from "../app/app-config";
import linters from "./linters";
import messages from "./messages";

export default class Badge {
  constructor(appOptions) {
    this.appOptions = appOptions;
  }

  updateForTabId(tabId) {
    cutil.withTab(tabId, (tab) => this.updateForTab(tab));
  }

  updateForActiveTab() {
    cutil.withActiveTab((tab) => this.updateForTab(tab));
  }

  updateForTab(tab) {
    if (tab.url && /^https?:/.test(tab.url)) {
      chrome.browserAction.enable(tab.id);
    } else {
      chrome.browserAction.disable(tab.id);
      chrome.browserAction.setBadgeText({ tabId: tab.id, text: "" });
      return;
    }

    const status = linters.getStatus(tab.id);
    if (status.lastError) {
      chrome.browserAction.setIcon({ tabId: tab.id, path: appConfig.deactiveIcon });
      chrome.browserAction.setBadgeBackgroundColor({ tabId: tab.id, color: "#F00" });
      chrome.browserAction.setBadgeText({ tabId: tab.id, text: "Err" });
      return;
    }

    messages.getStatus(tab.id).then(({active, marks, counts}) => {
      chrome.browserAction.setIcon({
        tabId: tab.id,
        path: active ? appConfig.activeIcon : appConfig.deactiveIcon
      });

      const severities = this.appOptions.badgeCountSeverity;
      if (active && status.clientLinted && !status.linting && !_.isEmpty(severities)) {
        const count = _.sumBy(severities, (sev) => counts[sev]);
        chrome.browserAction.setBadgeText({
          tabId: tab.id,
          text: count > 0 ? count.toString() : "OK"
        });
        chrome.browserAction.setBadgeBackgroundColor({
          tabId: tab.id,
          color: count > 0 ? "#EC1A2A" : "#99EC6B"
        });
      } else {
        chrome.browserAction.setBadgeText({ tabId: tab.id, text: "" });
      }

      if (!active && linters.isActive(tab.id)) {
        linters.deactivate(tab.id);
      }
    });
  }
}
