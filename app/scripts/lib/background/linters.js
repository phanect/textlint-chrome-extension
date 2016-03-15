/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import textlintConfig from "../textlint/textlint-config";
import LinterStatus from "./linter-status";
import sandboxClient from "./sandbox-client";
import messages from "./messages";

const linterStatus = {};

function getStatus(tabId) {
  return linterStatus[tabId] || (linterStatus[tabId] = new LinterStatus(tabId));
}

function getAllActives() {
  return _.filter(linterStatus, "active");
}

function isActive(tabId) {
  return linterStatus[tabId] && linterStatus[tabId].active;
}

function activate(tabId, presetName, format) {
  textlintConfig.getPresetOrDefault(presetName).then((preset) => {
    getStatus(tabId).beforeActivating(preset, format);
    sandboxClient.activate(tabId, preset.rules, preset.ruleOptions, format);
  }).catch((error) => {
    getStatus(tabId).setLastError(error);
  });
}
sandboxClient.onReturnActivate(({tabId, error}) => {
  if (getStatus(tabId).afterServerActivating(error)) {
    messages.activateLinter(tabId).then(() => {
      getStatus(tabId).afterClientActivating();
    });
  }
});

function deactivate(tabId) {
  delete linterStatus[tabId];
  sandboxClient.deactivate(tabId);
}
sandboxClient.onReturnDeactivate(({tabId, error}) => {
  messages.deactivateLinter(tabId);
});

function reload(tabId) {
  const status = linterStatus[tabId];
  if (status) activate(tabId, status.preset.name, status.format);
}

function lintText(tabId, lintId, text) {
  getStatus(tabId).beforeLintingText();
  sandboxClient.lintText(tabId, lintId, text);
}
sandboxClient.onReturnLintText(({tabId, lintId, lintResult, error}) => {
  if (getStatus(tabId).afterServerLintingText(error)) {
    messages.sendLintResult(tabId, lintId, lintResult).then(() => {
      getStatus(tabId).afterClientLintingText();
    });
  }
});

function correctText(tabId, correctId, text) {
  getStatus(tabId).beforeCorrectingText();
  sandboxClient.correctText(tabId, correctId, text);
}
sandboxClient.onReturnCorrectText(({tabId, correctId, correctResult, error}) => {
  if (getStatus(tabId).afterServerCorrectingText(error)) {
    messages.sendCorrectResult(tabId, correctId, correctResult).then(() => {
      getStatus(tabId).afterClientCorrectingText();
    });
  }
});

export default {
  getStatus: getStatus,
  getAllActives: getAllActives,
  isActive: isActive,
  activate: activate,
  deactivate: deactivate,
  reload: reload,
  lintText: lintText,
  correctText: correctText,
}
