/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import _ from "lodash";
import AppOptions from "../app/app-options";
import Badge from "./badge";
import linters from "./linters";
import messages from "./messages";

export default function () {
  const appOptions = new AppOptions({});
  const badge = new Badge(appOptions);

  appOptions.load();

  // runtime.onStartup and onInstalled are not supported yet on Firefox.
  // http://arewewebextensionsyet.com/#runtime
  if (chrome.runtime.onStartup) {
    chrome.runtime.onStartup.addListener(() => {
      badge.updateForActiveTab();
    });
  }
  if (chrome.runtime.onInstalled) {
    chrome.runtime.onInstalled.addListener(() => {
      badge.updateForActiveTab();
    });
  }

  chrome.tabs.onActivated.addListener((activeInfo) => {
    badge.updateForTabId(activeInfo.tabId);
  });
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) badge.updateForTab(tab);
  });
  chrome.tabs.onRemoved.addListener((tabId) => {
    linters.deactivate(tabId);
  });

  appOptions.observeUpdate(({ oldValue, newValue }) => {
    const ruleChanged = oldValue ? !_.isEqual(oldValue.ruleOptions, newValue.ruleOptions) : true;
    _.each(linters.getAllActives(), (linter) => {
      if (ruleChanged && linter.isUsingCustomRule()) {
        linters.reload(linter.tabId);
      }
      messages.updateOptions(linter.tabId, appOptions.contentOptions, ruleChanged);
    });
    badge.updateForActiveTab();
  });

  messages.onError((reason) => {
    if (reason === "Could not establish connection. Receiving end does not exist.") {
      // Suppress error because this error occurs everytime when reloaded extension
      return;
    }
    console.error("Error on sending message:", reason);
  });
  messages.onLintText(({ lintId, text }, sender, sendResponse) => {
    if (sender.tab) linters.lintText(sender.tab.id, lintId, text);
    sendResponse();
  });
  messages.onCorrectText(({ correctId, text }, sender, sendResponse) => {
    if (sender.tab) linters.correctText(sender.tab.id, correctId, text);
    sendResponse();
  });
  messages.onUpdateStatus((msg, sender, sendResponse) => {
    if (sender.tab) badge.updateForTab(sender.tab);
    sendResponse();
  });
  messages.onGetOptions((msg, sender, sendResponse) => {
    sendResponse(appOptions.contentOptions);
  });

  // Export for popup
  window.linters = linters;
}
