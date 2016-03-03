"use strict";

import EventEmitter from "events";

const eventEmitter = new EventEmitter();
const knownEvents = "Status RequestLint";

// Register message receiver
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type && knownEvents.indexOf(message.type) >= 0) {
    eventEmitter.emit(message.type, message, sender, sendResponse);
  } else {
    console.error("Unknown message:", message, ", sender: ", sender);
  }
});

export default {
  onReceiveStatus(callback) {
    eventEmitter.on("Status", callback);
  },

  onRequestLint(callback) {
    eventEmitter.on("RequestLint", callback);
  },

  requestStatus(tabId) {
    chrome.tabs.sendMessage(tabId, {
      type: "RequestStatus"
    });
  },

  requestToggle(tabId) {
    chrome.tabs.sendMessage(tabId, {
      type: "RequestToggle"
    });
  },

  sendLintResult(tabId, textareaId, lintMessages) {
    chrome.tabs.sendMessage(tabId, {
      type: "LintResult",
      textareaId: textareaId,
      lintMessages: lintMessages
    });
  },

  showMark(tabId, markId) {
    chrome.tabs.sendMessage(tabId, {
      type: "ShowMark",
      markId: markId
    });
  },
}
