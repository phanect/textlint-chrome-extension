"use strict";

// Enable chromereload by uncommenting this line:
// import './lib/livereload';

import BackgroundMessages from "./lib/background-messages";
import TextCaretScanner from "./lib/text-caret-scanner";

let textlint;
function getTextlint() {
  if (!textlint) {
    // Delay load
    textlint = require("./lib/textlint-wrapper").default.textlint;
  }
  return textlint;
}

const ACTIVE_ICON = {
  "19": "images/icon-19.png",
  "38": "images/icon-38.png"
};
const DEACTIVE_ICON = {
  "19": "images/icon-black-19.png",
  "38": "images/icon-black-38.png"
};

chrome.runtime.onInstalled.addListener(() => {
  // Show pageAction when textarea exists in loaded page
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          css: ["textarea"]
        })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

// Set listener for handling pageAction
chrome.pageAction.onClicked.addListener((tab) => {
  BackgroundMessages.requestToggle(tab.id, (response) => {
    let active = response.active;
    chrome.pageAction.setIcon({
      tabId: tab.id,
      path: active ? ACTIVE_ICON : DEACTIVE_ICON
    });
  });
});

BackgroundMessages.onLint((message, sender) => {
  let {textareaId, text} = message;
  getTextlint().lintText(text, ".txt").then(({messages}) => {
    if (sender.tab) {
      let lintMessages = buildLintMessages(text, messages);
      BackgroundMessages.sendLintResult(sender.tab.id, textareaId, lintMessages);
    }
  }).catch((error) => {
    console.error(error);
  });
});

function buildLintMessages(text, messages) {
  let scanner = new TextCaretScanner(text);
  return messages.map((m) => {
    let range = scanner.getWordRangeFromLineColumn(m.line, m.column);
    return {
      "start":    range[0],
      "end":      range[1],
      "message":  m.message,
      "ruleId":   m.ruleId,
      "severity": m.severity
    };
  });
}
