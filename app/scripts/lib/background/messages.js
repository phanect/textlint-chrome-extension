"use strict";

import messages from "../app/app-message";

export default {
  onError(callback) {
    messages.onError(callback);
  },

  onGetOptions(callback) {
    messages.on(messages.GET_OPTIONS, callback);
  },

  onLintText(callback) {
    messages.on(messages.LINT_TEXT, callback);
  },

  onCorrectText(callback) {
    messages.on(messages.CORRECT_TEXT, callback);
  },

  onUpdateStatus(callback) {
    messages.on(messages.UPDATE_STATUS, callback);
  },

  getStatus(tabId) {
    return messages.tabSend(tabId, messages.GET_STATUS);
  },

  activateLinter(tabId) {
    return messages.tabSend(tabId, messages.ACTIVATE_LINTER);
  },

  deactivateLinter(tabId) {
    return messages.tabSend(tabId, messages.DEACTIVATE_LINTER);
  },

  sendLintResult(tabId, lintId, lintResult) {
    return messages.tabSend(tabId, messages.LINT_RESULT, { lintId, lintResult });
  },

  sendCorrectResult(tabId, correctId, correctResult) {
    return messages.tabSend(tabId, messages.CORRECT_RESULT, { correctId, correctResult });
  },

  showMark(tabId, markId) {
    return messages.tabSend(tabId, messages.SHOW_MARK, { markId });
  },

  triggerCorrect(tabId) {
    return messages.tabSend(tabId, messages.TRIGGER_CORRECT);
  },

  undo(tabId) {
    return messages.tabSend(tabId, messages.UNDO);
  },

  updateOptions(tabId, options, ruleChanged) {
    return messages.tabSend(tabId, messages.UPDATE_OPTIONS, { options, ruleChanged });
  },
}
