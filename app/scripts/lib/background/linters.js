/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import textlintRulesets from "../textlint/textlint-rulesets";
import LinterStatus from "./linter-status";
import sandboxClient from "./sandbox-client";
import messages from "./messages";

let linterStatus = {};

function reset() {
  linterStatus = {};
}

function getStatus(tabId) {
  return linterStatus[tabId] || (linterStatus[tabId] = new LinterStatus(tabId));
}

function getAllActives() {
  return _.filter(linterStatus, "active");
}

function isActive(tabId) {
  return (linterStatus[tabId] && linterStatus[tabId].active) || false;
}

function activate(tabId, rulesetName, format) {
  textlintRulesets.getRulesetOrDefault(rulesetName).then((ruleset) => {
    getStatus(tabId).beforeActivating(ruleset, format);
    sandboxClient.activate(tabId, ruleset.rules, ruleset.ruleOptions, format);
  }).catch((error) => {
    getStatus(tabId).setLastError(error);
  });
}
function onReturnActivate({ tabId, error }) {
  if (getStatus(tabId).afterServerActivating(error)) {
    messages.activateLinter(tabId).then(() => {
      getStatus(tabId).afterClientActivating();
    });
  }
}

function deactivate(tabId) {
  delete linterStatus[tabId];
  sandboxClient.deactivate(tabId);
}
function onReturnDeactivate({ tabId }) {
  messages.deactivateLinter(tabId);
}

function reload(tabId) {
  const status = linterStatus[tabId];
  if (status) activate(tabId, status.ruleset.name, status.format);
}

function lintText(tabId, lintId, text) {
  getStatus(tabId).beforeLintingText();
  sandboxClient.lintText(tabId, lintId, text);
}
function onReturnLintText({ tabId, lintId, lintResult, error }) {
  if (getStatus(tabId).afterServerLintingText(error)) {
    messages.sendLintResult(tabId, lintId, lintResult).then(() => {
      getStatus(tabId).afterClientLintingText();
    });
  }
}

function correctText(tabId, correctId, text) {
  getStatus(tabId).beforeCorrectingText();
  sandboxClient.correctText(tabId, correctId, text);
}
function onReturnCorrectText({ tabId, correctId, correctResult, error }) {
  if (getStatus(tabId).afterServerCorrectingText(error)) {
    messages.sendCorrectResult(tabId, correctId, correctResult).then(() => {
      getStatus(tabId).afterClientCorrectingText();
    });
  }
}

function bindSandboxClient() {
  sandboxClient.onReturnActivate(onReturnActivate);
  sandboxClient.onReturnDeactivate(onReturnDeactivate);
  sandboxClient.onReturnLintText(onReturnLintText);
  sandboxClient.onReturnCorrectText(onReturnCorrectText);
}
bindSandboxClient();

export default {
  reset,
  bindSandboxClient,
  getStatus,
  getAllActives,
  isActive,
  activate,
  deactivate,
  reload,
  lintText,
  correctText,
};
