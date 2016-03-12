"use strict";

import messages from "../app/sandbox-message";

export default {
  activate(tabId, ruleNames, ruleOptions, format) {
    messages.send(messages.ACTIVATE, {tabId, ruleNames, ruleOptions, format});
  },
  onReturnActivate(callback) {
    messages.on(messages.RETURN_ACTIVATE, callback);
  },

  deactivate(tabId) {
    messages.send(messages.DEACTIVATE, {tabId});
  },
  onReturnDeactivate(callback) {
    messages.on(messages.RETURN_DEACTIVATE, callback);
  },

  lintText(tabId, lintId, text) {
    messages.send(messages.LINT_TEXT, {tabId, lintId, text});
  },
  onReturnLintText(callback) {
    messages.on(messages.RETURN_LINT_TEXT, callback);
  },

  correctText(tabId, correctId, text) {
    messages.send(messages.CORRECT_TEXT, {tabId, correctId, text});
  },
  onReturnCorrectText(callback) {
    messages.on(messages.RETURN_CORRECT_TEXT, callback);
  },
}
