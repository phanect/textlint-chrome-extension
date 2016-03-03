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

messages.onRequestActiveState(() => {
  let active = textareaLinter ? textareaLinter.active : false;
  messages.notifyActiveState(active);
});

messages.onRequestToggle(() => {
  initTextareaLinter();
  textareaLinter.toggle();
  messages.notifyActiveState(textareaLinter.active);
});

messages.onLintResult(({textareaId, lintMessages}) => {
  textareaLinter.receiveLintResult(textareaId, lintMessages);
});
