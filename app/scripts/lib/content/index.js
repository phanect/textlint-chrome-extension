/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import messages from "./messages";

export default function () {
  let textareaLinter;

  function initTextareaLinter() {
    return new Promise((resolve, reject) => {
      if (textareaLinter) {
        resolve(textareaLinter);
      } else {
        messages.getOptions().then((options) => {
          // Delay load to avoid initial impact
          let TextareaLinter = require("./textarea-linter").TextareaLinter;
          textareaLinter = new TextareaLinter({
            lintText: (lintId, text) => { messages.lintText(lintId, text) },
            correctText: (correctId, text) => { messages.correctText(correctId, text) },
            onMarksChanged: () => { messages.updateStatus() },
            showMarks: options.showMarks,
            showBorder: options.showBorder,
          });
          resolve(textareaLinter);
        });
      }
    });
  }

  let lastActiveTextarea = null;
  document.body.addEventListener("focusin", (ev) => {
    if (ev.target && ev.target.tagName && ev.target.tagName.toLowerCase() === "textarea") {
      lastActiveTextarea = ev.target;
    }
  }, false);

  messages.onGetStatus((msg, sender, sendResponse) => {
    const active = textareaLinter ? textareaLinter.active : false;
    const marks = textareaLinter ? textareaLinter.getCurrentLintMarks() : [];
    const counts = { info: 0, warning: 0, error: 0 };
    marks.forEach((mark) => { counts[mark.severity]++ });
    const undoCount = textareaLinter ? textareaLinter.getCurrentUndoCount() : 0;
    sendResponse({ active, marks, counts, undoCount });
  });

  messages.onActivateLinter((msg, sender, sendResponse) => {
    initTextareaLinter().then(() => {
      textareaLinter.activate();
      if (lastActiveTextarea) {
        textareaLinter.lintTextArea(lastActiveTextarea);
      }
      messages.updateStatus();
      sendResponse({ active: textareaLinter.active });
    });
    return true;
  });

  messages.onDeactivateLinter((msg, sender, sendResponse) => {
    if (textareaLinter) {
      textareaLinter.deactivate();
      messages.updateStatus();
      sendResponse({ active: textareaLinter.active });
    } else {
      sendResponse({ active: false });
    }
  });

  messages.onLintResult((lintResult, sender, sendResponse) => {
    textareaLinter.receiveLintResult(lintResult);
    sendResponse();
  });

  messages.onCorrectResult((correctResult, sender, sendResponse) => {
    textareaLinter.receiveCorrectResult(correctResult);
    sendResponse();
  });

  messages.onShowMark(({markId}, sender, sendResponse) => {
    if (textareaLinter) textareaLinter.showMark(markId);
    sendResponse();
  });

  messages.onTriggerCorrect((msg, sender, sendResponse) => {
    if (textareaLinter) textareaLinter.correct();
    sendResponse();
  });

  messages.onUndo((msg, sender, sendResponse) => {
    if (textareaLinter) textareaLinter.undo();
    sendResponse();
  });

  messages.onUpdateOptions(({options, ruleChanged}, sender, sendResponse) => {
    if (textareaLinter) {
      textareaLinter.setOptions(options);
    }
    sendResponse();
  });

  messages.updateStatus();
}
