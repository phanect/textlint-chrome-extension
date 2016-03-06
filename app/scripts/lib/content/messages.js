"use strict";

import messages from "../app/app-message";

export default {
  onError(callback) {
    messages.onError(callback);
  },

  onGetStatus(callback) {
    messages.on(messages.GET_STATUS, callback);
  },

  onToggleLinter(callback) {
    messages.on(messages.TOGGLE_LINTER, callback);
  },

  onShowMark(callback) {
    messages.on(messages.SHOW_MARK, callback);
  },

  lintText(text) {
    return messages.send(messages.LINT_TEXT, { text: text });
  },

  updateStatus() {
    return messages.send(messages.UPDATE_STATUS);
  },
}
