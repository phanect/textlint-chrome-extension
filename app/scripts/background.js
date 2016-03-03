"use strict";

// Enable chromereload by uncommenting this line:
import './lib/background/livereload';

import textlint from "./lib/util/textlint-wrapper";
import messages from "./lib/background/messages";

const ACTIVE_ICON = {
  "19": "images/icon-19.png",
  "38": "images/icon-38.png"
};
const DEACTIVE_ICON = {
  "19": "images/icon-black-19.png",
  "38": "images/icon-black-38.png"
};

messages.onActiveState(({active}, sender) => {
  if (!sender.tab) return;
  chrome.browserAction.setIcon({
    tabId: sender.tab.id,
    path: active ? ACTIVE_ICON : DEACTIVE_ICON
  });
  if (!active) {
    chrome.browserAction.setBadgeText({ tabId: sender.tab.id, text: "" });
  }
});

messages.onRequestLint(({textareaId, text}, sender) => {
  textlint.lint(text).then(({lintMessages, severityCounts}) => {
    if (!sender.tab) return;
    messages.sendLintResult(sender.tab.id, textareaId, lintMessages);

    let gotErrors = (severityCounts["error"] > 0);
    chrome.browserAction.setBadgeText({
      tabId: sender.tab.id,
      text: gotErrors ? severityCounts["error"].toString() : "OK"
    });
    chrome.browserAction.setBadgeBackgroundColor({
      tabId: sender.tab.id,
      color: gotErrors ? "#EC1A2A" : "#99EC6B"
    });
  }).catch((error) => {
    console.error(error);
  });
});
