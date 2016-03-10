"use strict";

import messages from "../app/app-message";

export default {
  onError(callback) {
    messages.onError(callback);
  },

  onGetStatus(callback) {
    messages.on(messages.GET_STATUS, callback);
  },

  onActivateLinter(callback) {
    messages.on(messages.ACTIVATE_LINTER, callback);
  },

  onDeactivateLinter(callback) {
    messages.on(messages.DEACTIVATE_LINTER, callback);
  },

  onLintResult(callback) {
    messages.on(messages.LINT_RESULT, callback);
  },

  onShowMark(callback) {
    messages.on(messages.SHOW_MARK, callback);
  },

  onUpdateOptions(callback) {
    messages.on(messages.UPDATE_OPTIONS, callback);
  },

  getOptions() {
    return messages.send(messages.GET_OPTIONS);
  },

  lintText(lintId, text) {
    return messages.send(messages.LINT_TEXT, { lintId, text });
  },

  updateStatus() {
    return messages.send(messages.UPDATE_STATUS);
  },
}
