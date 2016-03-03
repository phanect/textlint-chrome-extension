"use strict";

import EventEmitter from "events";

const eventEmitter = new EventEmitter();
const knownEvents = "ACTIVESTATE REQLINT";

// Register message receiver
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type && knownEvents.indexOf(message.type) >= 0) {
    eventEmitter.emit(message.type, message, sender, sendResponse);
  } else {
    console.error("Unknown message:", message, ", sender: ", sender);
  }
});

export default {
  onActiveState(callback) {
    eventEmitter.on("ACTIVESTATE", callback);
  },

  onRequestLint(callback) {
    eventEmitter.on("REQLINT", callback);
  },

  requestActiveState(tabId) {
    chrome.tabs.sendMessage(tabId, {
      type: "REQACTIVESTATE"
    });
  },

  requestToggle(tabId) {
    chrome.tabs.sendMessage(tabId, {
      type: "REQTOGGLE"
    });
  },

  sendLintResult(tabId, textareaId, lintMessages) {
    chrome.tabs.sendMessage(tabId, {
      type: "LINTRESULT",
      textareaId: textareaId,
      lintMessages: lintMessages
    });
  },
}
