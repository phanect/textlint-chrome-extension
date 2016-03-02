"use strict";

let messageHandlers = {};

// Register message receiver
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  let messageType = message.type;
  if (messageType && messageHandlers[messageType]) {
    messageHandlers[messageType].call(null, message, sender, sendResponse);
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
