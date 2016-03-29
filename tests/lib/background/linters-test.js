/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import linters from "../../../app/scripts/lib/background/linters";
import LinterStatus from "../../../app/scripts/lib/background/linter-status";
import sandboxMessage from "../../../app/scripts/lib/app/sandbox-message";
import backgroundMessages from "../../../app/scripts/lib/background/messages";
import sandboxClient from "../../../app/scripts/lib/background/sandbox-client";
import textlintRulesets from "../../../app/scripts/lib/textlint/textlint-rulesets";

describe("linters", () => {
  beforeEach(() => {
    linters.reset();
    sandboxMessage.reset();
    linters.bindSandboxClient();
  });

  const tabId = 123;
  const ruleset = { name: "Custom", rules: ["test"], ruleOptions: { test: true } };
  const format = "md";

  function activateTab(aTabId) {
    linters.getStatus(aTabId).beforeActivating(ruleset, format);
    linters.getStatus(aTabId).afterServerActivating(null);
    linters.getStatus(aTabId).afterClientActivating();
  }

  describe("#getStatus()", () => {
    it("returns LinterStatus", () => {
      assert(linters.getStatus(tabId) instanceof LinterStatus);
    });
  });

  describe("#getAllActives()", () => {
    const activeIds = [1, 2, 3];
    beforeEach(() => {
      activeIds.map(activateTab);
      linters.getStatus(4); // for testing
    });
    it("returns all active statuses", () => {
      const returned = linters.getAllActives();
      assert(_.isArray(returned));
      assert(returned.length === activeIds.length);
      assert.deepEqual(_.map(returned, "tabId").sort(), activeIds);
    });
  });

  describe("#isActive()", () => {
    it("returns false for inactive tabId", () => {
      assert(linters.isActive(tabId) === false);
    });
    it("returns true for active tabId", () => {
      activateTab(tabId);
      assert(linters.isActive(tabId) === true);
    });
  });

  describe("#activate()", () => {
    function callActivate(callback) {
      sinonsb.stub(textlintRulesets, "getRulesetOrDefault", () => {
        return Promise.resolve(ruleset);
      });
      sinonsb.stub(sandboxClient, "activate", callback);
      linters.activate(tabId, ruleset.name, format);
    }

    it("sends activate message to sandbox", (done) => {
      callActivate((sendingTabId, sendingRules, sendingRuleOptions, sendingFormat) => {
        assert(sendingTabId === tabId);
        assert.deepEqual(sendingRules, ruleset.rules);
        assert.deepEqual(sendingRuleOptions, ruleset.ruleOptions);
        assert(sendingFormat === format);
        done();
      });
    });

    it("sets ruleset name and format to linter status", (done) => {
      callActivate(() => {
        assert.deepEqual(linters.getStatus(tabId).ruleset, ruleset);
        assert(linters.getStatus(tabId).format === format);
        done();
      });
    });
  });

  describe("#onReturnActivate()", () => {
    it("sends activate message to content script", (done) => {
      sinonsb.stub(backgroundMessages, "activateLinter", (givenTabId) => {
        assert(givenTabId === tabId);
        done();
      });
      window.postMessage({ type: sandboxMessage.RETURN_ACTIVATE, tabId }, "*");
    });
  });

  describe("#deactivate()", () => {
    function callDeactivate(cb) {
      sinonsb.stub(sandboxClient, "deactivate", cb);
      linters.deactivate(tabId);
    }

    it("sends deactivate message to sandbox", (done) => {
      callDeactivate((sendingTabId) => {
        assert(sendingTabId === tabId);
        done();
      });
    });
  });

  describe("#onReturnDeactivate()", () => {
    it("sends deactivate message to content script", (done) => {
      sinonsb.stub(backgroundMessages, "deactivateLinter", (givenTabId) => {
        assert(givenTabId === tabId);
        done();
      });
      window.postMessage({ type: sandboxMessage.RETURN_DEACTIVATE, tabId }, "*");
    });
  });

  describe("#reload()", () => {
    it("re-activates linter with the same ruleset and format", (done) => {
      sinonsb.stub(textlintRulesets, "getRulesetOrDefault", () => {
        return Promise.resolve(ruleset);
      });
      sinonsb.stub(sandboxClient, "activate", (aTabId, aRules, aRuleOptions, aFormat) => {
        assert(aTabId === tabId);
        assert.deepEqual(aRules, ruleset.rules);
        assert.deepEqual(aRuleOptions, ruleset.ruleOptions);
        assert(aFormat === format);
        done();
      });
      activateTab(tabId);
      linters.reload(tabId);
    });
  });

  describe("#lintText()", () => {
    const lintId = "lint1";
    const text = "Test text";

    function callLintText(cb) {
      sinonsb.stub(sandboxClient, "lintText", cb);
      linters.lintText(tabId, lintId, text);
    }

    it("sends lintText message to sandbox", (done) => {
      callLintText((sendingTabId, sendingLintId, sendingText) => {
        assert(sendingTabId === tabId);
        assert(sendingLintId === lintId);
        assert(sendingText === text);
        done();
      });
    });
  });

  describe("#onReturnLintText()", () => {
    const lintId = "lint1";
    const lintResult = { foo: "bar" };

    it("sends lint result to content script", (done) => {
      sinonsb.stub(backgroundMessages, "sendLintResult",
        (aTabId, aLintId, aResult) => {
          assert(aTabId === tabId);
          assert(aLintId === lintId);
          assert.deepEqual(aResult, lintResult);
          done();
        }
      );
      window.postMessage({
        type: sandboxMessage.RETURN_LINT_TEXT,
        tabId, lintId, lintResult,
      }, "*");
    });
  });

  describe("#correctText()", () => {
    const correctId = "correct1";
    const text = "Test text";

    function callCorrectText(cb) {
      sinonsb.stub(sandboxClient, "correctText", cb);
      linters.correctText(tabId, correctId, text);
    }

    it("sends correctText message to sandbox", (done) => {
      callCorrectText((sendingTabId, sendingCorrectId, sendingText) => {
        assert(sendingTabId === tabId);
        assert(sendingCorrectId === correctId);
        assert(sendingText === text);
        done();
      });
    });
  });

  describe("#onReturnCorrectText()", () => {
    const correctId = "correct1";
    const correctResult = { foo: "bar" };

    it("sends correct result to content script", (done) => {
      sinonsb.stub(backgroundMessages, "sendCorrectResult",
        (aTabId, aCorrectId, aResult) => {
          assert(aTabId === tabId);
          assert(aCorrectId === correctId);
          assert.deepEqual(aResult, correctResult);
          done();
        }
      );
      window.postMessage({
        type: sandboxMessage.RETURN_CORRECT_TEXT,
        tabId, correctId, correctResult,
      }, "*");
    });
  });
});
