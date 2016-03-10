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

  sendLintResult(tabId, lintId, lintMessages) {
    return messages.tabSend(tabId, messages.LINT_RESULT, { lintId, lintMessages });
  },

  showMark(tabId, markId) {
    return messages.tabSend(tabId, messages.SHOW_MARK, { markId });
  },

  updateOptions(tabId, options, ruleChanged) {
    return messages.tabSend(tabId, messages.UPDATE_OPTIONS, { options, ruleChanged });
  },
}
