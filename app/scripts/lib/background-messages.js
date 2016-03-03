"use strict";

let messageHandlers = {};

// Register message receiver
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type && messageHandlers[message.type]) {
    messageHandlers[message.type].call(null, message, sender, sendResponse);
  } else {
    console.error("Unknown message:", message, ", sender: ", sender);
  }
});

export default {
  onLint(callback) {
    messageHandlers["LINT"] = callback;
  },

  requestToggle(tabId, callback) {
    chrome.tabs.sendMessage(tabId, {
      type: "TOGGLE"
    }, callback);
  },

  sendLintResult(tabId, textareaId, lintMessages) {
    chrome.tabs.sendMessage(tabId, {
      type: "LINTRESULT",
      textareaId: textareaId,
      lintMessages: lintMessages
    });
  },
}
