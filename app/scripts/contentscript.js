"use strict";

import ContentMessages from "./lib/content-messages";

let textareaLinter;
function initTextareaLinter() {
  if (!textareaLinter) {
    // Delay load to avoid initial impact
    let TextareaLinter = require("./lib/textarea-linter").TextareaLinter;
    textareaLinter = new TextareaLinter();
  }
  return textareaLinter;
}

ContentMessages.onRequestActiveState(() => {
  let active = textareaLinter ? textareaLinter.active : false;
  ContentMessages.notifyActiveState(active);
});

ContentMessages.onRequestToggle(() => {
  initTextareaLinter();
  textareaLinter.toggle();
  ContentMessages.notifyActiveState(textareaLinter.active);
});

ContentMessages.onLintResult(({textareaId, lintMessages}) => {
  textareaLinter.receiveLintResult(textareaId, lintMessages);
});
