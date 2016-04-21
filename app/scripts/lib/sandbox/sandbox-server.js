/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

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

  onCorrectText(callback) {
    messages.on(messages.CORRECT_TEXT, callback);
  },
};
