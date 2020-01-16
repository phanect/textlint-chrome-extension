/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import messages from "./messages";

export default function () {
  let textareaLinter;

  function initTextareaLinter() {
    if (textareaLinter) {
      return Promise.resolve(textareaLinter);
    } else {
      return messages.getOptions().then((options) => {
        // Delay load to avoid initial impact
        const { TextareaLinter } = require("./textarea-linter");
        textareaLinter = new TextareaLinter({
          lintText: (lintId, text) => { messages.lintText(lintId, text); },
          correctText: (correctId, text) => { messages.correctText(correctId, text); },
          onMarksChanged: () => { messages.updateStatus(); },
          showMarks: options.showMarks,
          showBorder: options.showBorder,
        });
        return textareaLinter;
      });
    }
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
    const counts = {
      info: 0,
      warning: 0,
      error: 0,
      dismissed: 0,
    };
    marks.forEach((mark) => { counts[mark.dismissed ? "dismissed" : mark.severity]++; });
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

  messages.onShowMark(({ markId }, sender, sendResponse) => {
    if (textareaLinter) textareaLinter.showMark(markId);
    sendResponse();
  });

  messages.onDismissMark(({ markId, dismissType }, sender, sendResponse) => {
    if (textareaLinter) textareaLinter.dismissMark(markId, dismissType);
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

  messages.onUpdateOptions(({ options, ruleChanged }, sender, sendResponse) => {
    if (textareaLinter) {
      textareaLinter.setOptions(options);
    }
    sendResponse();
  });

  messages.updateStatus();
}
