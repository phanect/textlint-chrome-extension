"use strict";

import _ from "lodash";

const MESSAGES = {
  ACTIVATE: "Activate",
  RETURN_ACTIVATE: "ReturnActivate",

  DEACTIVATE: "Deactivate",
  RETURN_DEACTIVATE: "ReturnDeactivate",

  LINT_TEXT: "LintText",
  RETURN_LINT_TEXT: "ReturnLintText",

  CORRECT_TEXT: "CorrectText",
  RETURN_CORRECT_TEXT: "ReturnCorrectText",
};
const VALID_MESSAGES = _.invert(MESSAGES);

const eventHandlers = {};
const sandboxIframe = document.getElementById("sandbox");

window.addEventListener("message", (event) => {
  const messageType = event.data.type;
  if (messageType && VALID_MESSAGES[messageType]) {
    if (eventHandlers[messageType]) {
      const sendResponse = (data) => {
        data = data || {};
        data.type = "Return" + messageType;
        DEBUG && console.log("     B <- S :", data);
        event.source.postMessage(data, event.origin);
      };
      return eventHandlers[messageType].call(this, event.data, sendResponse);
    }
  } else {
    console.error("Unknown message:", event.data);
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

function send(messageType, message) {
  message = _.extend({ type: messageType }, message);
  DEBUG && console.log("     B -> S :", message);
  sandboxIframe.contentWindow.postMessage(message, '*');
}

export default _.extend({}, MESSAGES, {
  on: on,
  send: send
});
