/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

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

  onCorrectResult(callback) {
    messages.on(messages.CORRECT_RESULT, callback);
  },

  onShowMark(callback) {
    messages.on(messages.SHOW_MARK, callback);
  },

  onDismissMark(callback) {
    messages.on(messages.DISMISS_MARK, callback);
  },

  onTriggerCorrect(callback) {
    messages.on(messages.TRIGGER_CORRECT, callback);
  },

  onUndo(callback) {
    messages.on(messages.UNDO, callback);
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

  correctText(correctId, text) {
    return messages.send(messages.CORRECT_TEXT, { correctId, text });
  },

  updateStatus() {
    return messages.send(messages.UPDATE_STATUS);
  },
};
