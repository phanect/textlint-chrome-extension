"use strict";

import _ from "lodash";

const MESSAGES = {
  // Background -> Content
  GET_STATUS: "GetStatus",
  ACTIVATE_LINTER: "ActivateLinter",
  DEACTIVATE_LINTER: "DeactivateLinter",
  LINT_RESULT: "LintResult",
  CORRECT_RESULT: "CorrectResult",
  SHOW_MARK: "ShowMark",
  TRIGGER_CORRECT: "TriggerCorrect",
  UNDO: "Undo",
  UPDATE_OPTIONS: "UpdateOptions",

  // Content -> Background
  GET_OPTIONS: "GetOptions",
  LINT_TEXT: "LintText",
  CORRECT_TEXT: "CorrectText",
  UPDATE_STATUS: "UpdateStatus",
};
const VALID_MESSAGES = _.invert(MESSAGES);

let eventHandlers = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type && VALID_MESSAGES[message.type]) {
    if (eventHandlers[message.type]) {
      DEBUG && console.log("Message recv ", message)
      return eventHandlers[message.type].call(this, message, sender, sendResponse);
    }
  } else {
    console.error("Unknown message:", message, ", sender: ", sender);
  }
});

function on(messageType, callback) {
  if (VALID_MESSAGES[messageType]) {
    if (eventHandlers[messageType]) {
      throw new Error(`Duplicate message handler for ${messageType}`);
    }
    eventHandlers[messageType] = callback;
  } else {
    throw new Error(`Unknown message type: ${messageType}`);
  }
}

function onError(callback) {
  eventHandlers["error"] = callback;
}

function tabSend(tabId, messageType, message) {
  return send(messageType, message, tabId);
}

function send(messageType, message, tabId) {
  const p = new Promise((resolve, reject) => {
    const callback = (response) => {
      let error = chrome.runtime.lastError;
      if (_.isUndefined(response) && error) {
        reject(error.message);
      } else {
        resolve(response);
      }
    };

    message = _.extend({ type: messageType }, message);
    if (tabId) {
      chrome.tabs.sendMessage(tabId, message, {}, callback);
    } else {
      chrome.runtime.sendMessage(message, {}, callback);
    }
    DEBUG && console.log("Message sent ", message);
  });

  if (eventHandlers["error"]) {
    p.catch(eventHandlers["error"]);
  }

  return p;
}

export default _.extend({}, MESSAGES, {
  on: on,
  onError: onError,
  tabSend: tabSend,
  send: send
});
