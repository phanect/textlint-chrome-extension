"use strict";

import messages from "../app/app-message";

export default {
  onError(callback) {
    messages.onError(callback);
  },

  onLintText(callback) {
    messages.on(messages.LINT_TEXT, callback);
  },

  onUpdateStatus(callback) {
    messages.on(messages.UPDATE_STATUS, callback);
  },

  onGetOptions(callback) {
    messages.on(messages.GET_OPTIONS, callback);
  },

  getStatus(tabId) {
    return messages.tabSend(tabId, messages.GET_STATUS);
  },

  toggleLinter(tabId) {
    return messages.tabSend(tabId, messages.TOGGLE_LINTER);
  },

  showMark(tabId, markId) {
    return messages.tabSend(tabId, messages.SHOW_MARK, { markId: markId });
  },

  updateOptions(tabId, options, ruleChanged) {
    return messages.tabSend(tabId, messages.UPDATE_OPTIONS,
      { options: options, ruleChanged: ruleChanged });
  },
}
