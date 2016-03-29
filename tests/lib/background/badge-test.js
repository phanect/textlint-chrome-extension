/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import Badge from "../../../app/scripts/lib/background/badge";
import AppOptions from "../../../app/scripts/lib/app/app-options";
import appConfig from "../../../app/scripts/lib/app/app-config";
import linters from "../../../app/scripts/lib/background/linters";
import messages from "../../../app/scripts/lib/background/messages";

describe("Badge", () => {
  const tabId = 123;
  let badge;
  let appOptions;
  beforeEach(() => {
    appOptions = new AppOptions();
    badge = new Badge(appOptions);
  });
  function assertIcon(path) {
    assert(chrome.browserAction.setIcon.calledOnce);
    const lastArgs = _.last(chrome.browserAction.setIcon.args);
    assert(lastArgs[0].tabId === tabId);
    assert(lastArgs[0].path === path);
  }
  function assertBadgeText(text) {
    assert(chrome.browserAction.setBadgeText.called);
    const lastArgs = _.last(chrome.browserAction.setBadgeText.args);
    assert(lastArgs[0].tabId === tabId);
    assert(lastArgs[0].text === text);
  }
  function assertBadgeColorChanged() {
    assert(chrome.browserAction.setBadgeBackgroundColor.called);
  }

  describe("#enable()", () => {
    beforeEach(() => { badge.enable(tabId); });
    it("enables badge", () => {
      assert(chrome.browserAction.enable.calledOnce);
      assert(chrome.browserAction.enable.firstCall.args[0] === tabId);
    });
  });

  describe("#disable()", () => {
    beforeEach(() => { badge.disable(tabId); });
    it("disables badge", () => {
      assert(chrome.browserAction.disable.calledOnce);
      assert(chrome.browserAction.disable.firstCall.args[0] === tabId);
    });
    it("empties badge text", () => {
      assertBadgeText("");
    });
  });

  describe("#activate()", () => {
    it("sets badge icon to active", () => {
      badge.activate(tabId);
      assertIcon(appConfig.activeIcon);
    });
  });

  describe("#deactivate()", () => {
    it("sets badge icon to deactive", () => {
      badge.deactivate(tabId);
      assertIcon(appConfig.deactiveIcon);
    });
  });

  describe("#toggleActive", () => {
    it("sets badge icon for active", () => {
      badge.toggleActive(tabId, true);
      assertIcon(appConfig.activeIcon);
    });
    it("sets badge icon for deactive", () => {
      badge.toggleActive(tabId, false);
      assertIcon(appConfig.deactiveIcon);
    });
  });

  describe("#showError", () => {
    beforeEach(() => { badge.showError(tabId); });
    it("sets badge background color", () => {
      assertBadgeColorChanged();
    });
    it("sets badge text to Err", () => {
      assertBadgeText("Err");
    });
  });

  describe("#showLintCount", () => {
    context("with no errors", () => {
      beforeEach(() => {
        badge.showLintCount(tabId, { error: 0, warning: 0, info: 0 });
      });

      it("sets badge background color", () => {
        assertBadgeColorChanged();
      });
      it("sets badge text to OK", () => {
        assertBadgeText("OK");
      });
    });

    context("with some errors", () => {
      beforeEach(() => {
        badge.showLintCount(tabId, { error: 5, warning: 0, info: 0 });
      });

      it("sets badge background color", () => {
        assertBadgeColorChanged();
      });
      it("sets badge text to error count", () => {
        assertBadgeText("5");
      });
    });

    context("with some warnings", () => {
      beforeEach(() => {
        badge.showLintCount(tabId, { error: 5, warning: 6, info: 7 });
      });

      it("sets badge background color", () => {
        assertBadgeColorChanged();
      });
      it("sets badge text to error count only", () => {
        assertBadgeText("5");
      });
    });

    context("with badgeCountSeverity changed", () => {
      beforeEach(() => {
        appOptions.badgeCountSeverity = "error,warning";
        badge.showLintCount(tabId, { error: 5, warning: 6, info: 7 });
      });

      it("sets badge background color", () => {
        assertBadgeColorChanged();
      });
      it("sets badge text to sum of severities", () => {
        assertBadgeText("11");
      });
    });
  });

  describe("#hideLintCount()", () => {
    it("empties badge text", () => {
      badge.hideLintCount(tabId);
      assertBadgeText("");
    });
  });

  describe("#updateForTab()", () => {
    context("with supported url", () => {
      const tab = {
        id: tabId,
        url: "http://example.com/",
      };
      function updateForTab(args) {
        args = _.defaultsDeep(args, {
          lastError: false,
          clientLinted: true,
          waiting: false,
          active: true,
          marks: [],
          counts: { error: 0, warning: 0, info: 0 },
        });
        sinonsb.stub(linters, "getStatus").returns({
          lastError: args.lastError,
          clientLinted: args.clientLinted,
          waiting: args.waiting,
        });
        sinonsb.stub(messages, "getStatus").returns(Promise.resolve({
          active: args.active,
          marks: args.marks,
          counts: args.counts,
        }));
        return badge.updateForTab(tab);
      }

      context("and error occurred", () => {
        beforeEach(() => updateForTab({ lastError: true }));
        it("shows error", () => {
          assertBadgeText("Err");
        });
      });

      context("and no marks", () => {
        beforeEach(() => updateForTab());
        it("shows OK", () => {
          assertBadgeText("OK");
        });
      });

      context("and mark errors", () => {
        beforeEach(() => updateForTab({ counts: { error: 5 } }));
        it("shows error count", () => {
          assertBadgeText("5");
        });
      });

      context("and client linting", () => {
        beforeEach(() => updateForTab({ clientLinted: false }));
        it("hides lint count", () => {
          assertBadgeText("");
        });
      });

      context("and waiting for lint", () => {
        beforeEach(() => updateForTab({ waiting: true }));
        it("hides lint count", () => {
          assertBadgeText("");
        });
      });

      context("and inactive", () => {
        let deactivateStub;
        beforeEach(() => {
          sinonsb.stub(linters, "isActive").returns(true);
          deactivateStub = sinonsb.stub(linters, "deactivate");
          return updateForTab({ active: false });
        });
        it("hides lint count", () => {
          assertBadgeText("");
        });
        it("deactivates linter if activated", () => {
          assert(deactivateStub.calledOnce);
        });
      });

      context("and badgeCountSeverity is none", () => {
        beforeEach(() => {
          appOptions.badgeCountSeverity = "none";
          return updateForTab();
        });
        it("hides lint count", () => {
          assertBadgeText("");
        });
      });
    });
  });
});
