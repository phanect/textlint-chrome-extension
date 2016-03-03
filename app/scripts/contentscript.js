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

ContentMessages.onToggle(() => {
  initTextareaLinter();
  textareaLinter.toggle();
  ContentMessages.changeActiveState(textareaLinter.active);
});

ContentMessages.onLintResult(({textareaId, lintMessages}) => {
  textareaLinter.receiveLintingResult(textareaId, lintMessages);
});
