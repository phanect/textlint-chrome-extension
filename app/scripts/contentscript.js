"use strict";

import messages from "./lib/content/messages";

let textareaLinter;
function initTextareaLinter() {
  if (!textareaLinter) {
    // Delay load to avoid initial impact
    let TextareaLinter = require("./lib/content/textarea-linter").TextareaLinter;
    textareaLinter = new TextareaLinter({
      lintText: lintText,
      onMarksChanged: onMarksChanged
    });
  }
  return textareaLinter;
}

function lintText(text) {
  return new Promise((resolve, reject) => {
    messages.lintText(text).then((message) => {
      if (message.error) {
        reject(message.error);
      } else {
        resolve(message.lintMessages);
      }
    })
    .catch(reject);
  });
}

function onMarksChanged() {
  messages.updateStatus();
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

messages.onToggleLinter((msg, sender, sendResponse) => {
  initTextareaLinter();
  textareaLinter.toggle();
  messages.updateStatus();
  sendResponse({ active: textareaLinter.active });
});

messages.onShowMark(({markId}) => {
  textareaLinter.showMark(markId);
});

messages.updateStatus();
