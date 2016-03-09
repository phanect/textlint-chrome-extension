"use strict";

// Enable chromereload by uncommenting this line:
import './lib/background/livereload';

import _ from "lodash";
import textlintConfig from "./lib/textlint/textlint-config";
import TextlintWrapper from "./lib/textlint/textlint-wrapper";
import cutil from "./lib/util/chrome-util";
import appConfig from "./lib/app/app-config";
import appStorage from "./lib/app/app-storage";
import AppOptions from "./lib/app/app-options";
import messages from "./lib/background/messages";

const appOptions = new AppOptions({});
const tabTextlints = {};

appStorage.getOptions().then((options) => {
  appOptions.overwrite(options);
});

function setupTextlintForTab(tabId, presetName) {
  return new Promise((resolve, reject) => {
    textlintConfig.getPresetOrDefault(presetName).then((preset) => {
      const tl = new TextlintWrapper(preset.rules, preset.ruleOptions);
      tabTextlints[tabId] = {
        textlint: tl,
        preset: preset.name,
      };
      const updateTab = _.bind(updateForTab, null, tabId);
      tl.onLoad(updateTab);
      tl.onLoadError(updateTab);
      resolve(tl);
    }).catch(reject);
  });
}

function reloadTextlintForTab(tabId) {
  return new Promise((resolve, reject) => {
    const old = tabTextlints[tabId];
    if (!old) return resolve(null);
    setupTextlintForTab(tabId, old.preset).then(resolve).catch(reject);
  });
}

function getTextlintForTab(tabId) {
  const entry = tabTextlints[tabId];
  return entry && entry.textlint;
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
    if (active && tl && !tl.isLinting() && !_.isEmpty(appOptions.badgeCountSeverity)) {
      let count = 0;
      _.each(appOptions.badgeCountSeverity, (sev) => { count += counts[sev] });
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

    if (!active && tl) {
      removeTextlintForTab(tab.id);
    }
  });
}
function updateForTabId(tabId) {
  cutil.withTab(tabId, updateForTab);
}
function updateForActiveTab() {
  cutil.withActiveTab(updateForTab);
}

messages.onError((reason) => {
  if (reason === "Could not establish connection. Receiving end does not exist.") {
    // Suppress error because this error occurs everytime when reloaded extension
    return;
  }
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
  sendResponse();
});

messages.onGetOptions((msg, sender, sendResponse) => {
  sendResponse(appOptions.contentOptions);
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
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (changes["options"]) {
    const {oldValue, newValue} = changes["options"];
    const ruleChanged = oldValue ? !_.isEqual(oldValue.ruleOptions, newValue.ruleOptions) : true;
    appOptions.overwrite(newValue);
    _.each(tabTextlints, (entry, tabId) => {
      tabId = _.parseInt(tabId);

      const update = () => messages.updateOptions(tabId, appOptions.contentOptions, ruleChanged);
      if (ruleChanged) {
        reloadTextlintForTab(tabId).then(update);
      } else {
        update();
      }
    });
    updateForActiveTab();
  }
});
chrome.runtime.onStartup.addListener(updateForActiveTab);
chrome.runtime.onInstalled.addListener(updateForActiveTab);

// Export for popup
window.setupTextlintForTab = setupTextlintForTab;
window.getTextlintForTab = getTextlintForTab;
window.removeTextlintForTab = removeTextlintForTab;
