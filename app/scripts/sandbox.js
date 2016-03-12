"use strict";

import _ from "lodash";
import TextlintWrapper from "./lib/textlint/textlint-wrapper";
import sandboxServer from "./lib/sandbox/sandbox-server";

const textlints = {};

sandboxServer.onActivate(({tabId, ruleNames, ruleOptions, format}, sendResponse) => {
  const textlint = new TextlintWrapper(ruleNames, ruleOptions, format);
  textlint.onLoad(() => {
    sendResponse({ tabId });
  });
  textlint.onLoadError((e) => {
    sendResponse({ tabId, error: e.message ? e.message : e });
  });
  textlints[tabId] = textlint;
});

sandboxServer.onDeactivate(({tabId}, sendResponse) => {
  delete textlints[tabId];
  sendResponse({ tabId });
});

sandboxServer.onLintText(({tabId, lintId, text}, sendResponse) => {
  const textlint = textlints[tabId];
  if (textlint) {
    textlint.lint(text).then((lintResult) => {
      sendResponse({ tabId, lintId, lintResult });
    }).catch((e) => {
      sendResponse({ tabId, lintId, error: e.message ? e.message : e });
    })
  } else {
    sendResponse({ tabId, lintId, error: "No textlint instance" });
  }
});

sandboxServer.onCorrectText(({tabId, correctId, text}, sendResponse) => {
  const textlint = textlints[tabId];
  if (textlint) {
    textlint.fix(text).then((correctResult) => {
      sendResponse({ tabId, correctId, correctResult })
    }).catch((e) => {
      sendResponse({ tabId, correctId, error: e.message ? e.message : e });
    });
  } else {
    sendResponse({ tabId, correctId, error: "No textlint instance" });
  }
});
