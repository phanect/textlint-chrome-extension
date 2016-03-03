"use strict";

import messages from "./lib/content/messages";

let textareaLinter;
function initTextareaLinter() {
  if (!textareaLinter) {
    // Delay load to avoid initial impact
    let TextareaLinter = require("./lib/content/textarea-linter").TextareaLinter;
    textareaLinter = new TextareaLinter();
  }
  return textareaLinter;
}

function sendStatus() {
  let active = textareaLinter ? textareaLinter.active : false;
  let marks = textareaLinter ? textareaLinter.getCurrentLintMarks() : [];
  messages.sendStatus(active, marks);
}

messages.onRequestStatus(() => {
  sendStatus();
});

messages.onRequestToggle(() => {
  initTextareaLinter();
  textareaLinter.toggle();
  sendStatus();
});

messages.onReceiveLintResult(({textareaId, lintMessages}) => {
  textareaLinter.receiveLintResult(textareaId, lintMessages);
  sendStatus();
});

messages.onShowMark(({markId}) => {
  textareaLinter.showMark(markId);
});
