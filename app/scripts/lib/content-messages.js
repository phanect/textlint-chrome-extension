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
  onToggle(callback) {
    messageHandlers["TOGGLE"] = callback;
  },

  onLintResult(callback) {
    messageHandlers["LINTRESULT"] = callback;
  },

  requestLinting(textareaId, text) {
    chrome.runtime.sendMessage({
      type: "LINT",
      textareaId: textareaId,
      text: text
    });
  },
}
