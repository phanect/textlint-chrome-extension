"use strict";

import EventEmitter from "events";

const eventEmitter = new EventEmitter();
const knownEvents = "REQACTIVESTATE REQTOGGLE LINTRESULT";

// Register message receiver
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type && knownEvents.indexOf(message.type) >= 0) {
    eventEmitter.emit(message.type, message, sender, sendResponse);
  } else {
    console.error("Unknown message:", message, ", sender: ", sender);
  }
});

export default {
  onRequestActiveState(callback) {
    eventEmitter.on("REQACTIVESTATE", callback);
  },

  onRequestToggle(callback) {
    eventEmitter.on("REQTOGGLE", callback);
  },

  onLintResult(callback) {
    eventEmitter.on("LINTRESULT", callback);
  },

  notifyActiveState(active) {
    chrome.runtime.sendMessage({
      type: "ACTIVESTATE",
      active: active
    });
  },

  requestLint(textareaId, text) {
    chrome.runtime.sendMessage({
      type: "REQLINT",
      textareaId: textareaId,
      text: text
    });
  },
}
