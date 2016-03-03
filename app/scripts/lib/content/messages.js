"use strict";

import EventEmitter from "events";

const eventEmitter = new EventEmitter();
const knownEvents = "RequestStatus RequestToggle LintResult ShowMark";

// Register message receiver
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type && knownEvents.indexOf(message.type) >= 0) {
    eventEmitter.emit(message.type, message, sender, sendResponse);
  } else {
    console.error("Unknown message:", message, ", sender: ", sender);
  }
});

export default {
  onRequestStatus(callback) {
    eventEmitter.on("RequestStatus", callback);
  },

  onRequestToggle(callback) {
    eventEmitter.on("RequestToggle", callback);
  },

  onReceiveLintResult(callback) {
    eventEmitter.on("LintResult", callback);
  },

  onShowMark(callback) {
    eventEmitter.on("ShowMark", callback);
  },

  sendStatus(active, marks) {
    chrome.runtime.sendMessage({
      type: "Status",
      active: active,
      marks: marks
    });
  },

  requestLint(textareaId, text) {
    chrome.runtime.sendMessage({
      type: "RequestLint",
      textareaId: textareaId,
      text: text
    });
  },
}
