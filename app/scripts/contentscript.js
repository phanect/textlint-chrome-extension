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
          lintText: lintText,
          onMarksChanged: onMarksChanged,
          showMarks: options.showMarks,
          showBorder: options.showBorder,
        });
        resolve(textareaLinter);
      });
    }
  });
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
  initTextareaLinter().then(() => {
    textareaLinter.toggle();
    messages.updateStatus();
    sendResponse({ active: textareaLinter.active });
  });
  return true;
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
