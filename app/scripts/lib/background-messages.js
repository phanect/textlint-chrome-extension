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
  onChangeActiveState(callback) {
    messageHandlers["ACTIVESTATE"] = callback;
  },

  onLint(callback) {
    messageHandlers["LINT"] = callback;
  },

  requestToggle(tabId) {
    chrome.tabs.sendMessage(tabId, {
      type: "TOGGLE"
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
