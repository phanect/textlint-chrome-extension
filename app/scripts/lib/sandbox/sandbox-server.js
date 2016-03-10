"use strict";

import messages from "../app/sandbox-message";

export default {
  onActivate(callback) {
    messages.on(messages.ACTIVATE, callback);
  },

  onDeactivate(callback) {
    messages.on(messages.DEACTIVATE, callback);
  },

  onLintText(callback) {
    messages.on(messages.LINT_TEXT, callback);
  },
}
