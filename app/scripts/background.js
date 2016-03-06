"use strict";

// Enable chromereload by uncommenting this line:
import './lib/background/livereload';

import _ from "lodash";
import TextlintWrapper from "./lib/util/textlint-wrapper";
import cutil from "./lib/util/chrome-util";
import messages from "./lib/background/messages";

const ACTIVE_ICON = {
  "19": "images/icon-19.png",
  "38": "images/icon-38.png"
};
const DEACTIVE_ICON = {
  "19": "images/icon-black-19.png",
  "38": "images/icon-black-38.png"
};

let tabTextlints = {};

function setupTextlintForTab(tabId, {rules, ruleOptions}) {
  const tl = new TextlintWrapper(rules, ruleOptions);
  tabTextlints[tabId] = tl;
  tl.onLoad(updateForActiveTab);
  tl.onLoadError(updateForActiveTab);
  return tl;
}

function getTextlintForTab(tabId) {
  return tabTextlints[tabId];
}

function removeTextlintForTab(tabId) {
  delete tabTextlints[tabId];
}

function updateForTab(tab) {
  if (tab.url && /^https?:/.test(tab.url)) {
    chrome.browserAction.enable(tab.id);
  } else {
    chrome.browserAction.disable(tab.id);
    chrome.browserAction.setBadgeText({ tabId: tab.id, text: "" });
    return;
  }

  const tl = getTextlintForTab(tab.id);
  if (tl && tl.isLoadingFailed()) {
    chrome.browserAction.setIcon({ tabId: tab.id, path: DEACTIVE_ICON });
    chrome.browserAction.setBadgeBackgroundColor({ tabId: tab.id, color: "#F00" });
    chrome.browserAction.setBadgeText({ tabId: tab.id, text: "Err" });
    return;
  }

  messages.getStatus(tab.id).then(({active, marks, counts}) => {
    chrome.browserAction.setIcon({
      tabId: tab.id,
      path: active ? ACTIVE_ICON : DEACTIVE_ICON
    });
    if (active && tl && !tl.isLinting()) {
      chrome.browserAction.setBadgeText({
        tabId: tab.id,
        text: counts.error > 0 ? counts.error.toString() : "OK"
      });
      chrome.browserAction.setBadgeBackgroundColor({
        tabId: tab.id,
        color: counts.error > 0 ? "#EC1A2A" : "#99EC6B"
      });
    } else {
      chrome.browserAction.setBadgeText({ tabId: tab.id, text: "" });
    }
  });
}
function updateForActiveTab() {
  cutil.withActiveTab(updateForTab);
}

messages.onError((reason) => {
  console.error("Error on sending message:", reason);
});

messages.onLintText(({text}, sender, sendResponse) => {
  if (!sender.tab) return;
  const tl = getTextlintForTab(sender.tab.id);
  if (!tl) {
    sendResponse({ error: "textlint is not set up" });
    return;
  }
  tl.lint(text).then((lintMessages) => {
    sendResponse({ lintMessages: lintMessages });
  }).catch((error) => {
    sendResponse({ error: error });
    console.error("Error on linting text:", error, text);
  });
  return true;
});

messages.onUpdateStatus((msg, sender, sendResponse) => {
  if (sender.tab) updateForTab(sender.tab);
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => { updateForTab(tab) });
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  updateForTab(tab);
});
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  removeTextlintForTab(tabId);
});
chrome.runtime.onStartup.addListener(updateForActiveTab);
chrome.runtime.onInstalled.addListener(updateForActiveTab);

// Export for popup
window.setupTextlintForTab = setupTextlintForTab;
window.getTextlintForTab = getTextlintForTab;
window.removeTextlintForTab = removeTextlintForTab;
