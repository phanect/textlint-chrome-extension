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
