"use strict";

import messages from "./lib/content/messages";

let textareaLinter;

function initTextareaLinter() {
  return new Promise((resolve, reject) => {
    if (textareaLinter) {
      resolve(textareaLinter);
    } else {
      messages.getOptions().then((options) => {
        // Delay load to avoid initial impact
        let TextareaLinter = require("./lib/content/textarea-linter").TextareaLinter;
        textareaLinter = new TextareaLinter({
          lintText: (lintId, text) => { messages.lintText(lintId, text) },
          onMarksChanged: () => { messages.updateStatus() },
          showMarks: options.showMarks,
          showBorder: options.showBorder,
        });
        resolve(textareaLinter);
      });
    }
  });
}

messages.onGetStatus((msg, sender, sendResponse) => {
  const marks = textareaLinter ? textareaLinter.getCurrentLintMarks() : [];
  const counts = { info: 0, warning: 0, error: 0 };
  marks.forEach((mark) => { counts[mark.severity]++ });
  sendResponse({
    active: textareaLinter ? textareaLinter.active : false,
    marks: marks,
    counts: counts
  });
});

messages.onActivateLinter((msg, sender, sendResponse) => {
  initTextareaLinter().then(() => {
    textareaLinter.activate();
    messages.updateStatus();
    sendResponse({ active: textareaLinter.active });
  });
  return true;
});

messages.onDeactivateLinter((msg, sender, sendResponse) => {
  if (textareaLinter) {
    textareaLinter.deactivate();
    messages.updateStatus();
  }
  sendResponse({ active: textareaLinter.active });
});

messages.onLintResult((lintResult, sender, sendResponse) => {
  textareaLinter.receiveLintResult(lintResult);
  sendResponse();
});

messages.onShowMark(({markId}, sender, sendResponse) => {
  if (textareaLinter) textareaLinter.showMark(markId);
  sendResponse();
});

messages.onUpdateOptions(({options, ruleChanged}, sender, sendResponse) => {
  if (textareaLinter) {
    textareaLinter.setOptions(options);
  }
  sendResponse();
});

messages.updateStatus();
