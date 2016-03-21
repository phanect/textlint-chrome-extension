/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import LinterStatus from "../../../app/scripts/lib/background/linter-status";

describe("LinterStatus", () => {
  let stubConsoleError;
  let linterStatus;
  const tabId = 123;

  beforeEach(() => {
    stubConsoleError = sinonsb.stub(console, "error");
    linterStatus = new LinterStatus(tabId);
  });

  describe("#constructor()", () => {
    it("sets given tabId", () => {
      assert(linterStatus.tabId === tabId);
    });
  });

  describe("#setLastError()", () => {
    const error = "Test error message";

    beforeEach(() => {
      linterStatus.setLastError(error);
    });

    it("sets lastError", () => {
      assert(linterStatus.lastError === error);
    });

    it("emits error log to console", () => {
      assert(stubConsoleError.called);
    });
  });

  describe("#beforeActivating()", () => {
    const ruleset = { name: "Custom" };
    const format = "md";
    beforeEach(() => {
      linterStatus.beforeActivating(ruleset, format);
    });
    it("sets ruleset and format", () => {
      assert(linterStatus.ruleset === ruleset);
      assert(linterStatus.format === format);
    });
    it("resets flags to false", () => {
      assert(linterStatus.active === false);
      assert(linterStatus.linting === false);
      assert(linterStatus.correcting === false);
      assert(linterStatus.waiting === false);
    });
  });

  describe("#afterServerActivating()", () => {
    context("when error is occurred", () => {
      let retval;
      beforeEach(() => {
        retval = linterStatus.afterServerActivating("Test error");
      });
      it("returns false", () => {
        assert(retval === false);
      });
      it("sets serverActive to false", () => {
        assert(linterStatus.serverActive === false);
      });
      it("sets active to false", () => {
        assert(linterStatus.active === false);
      });
    });
    context("when error is not occurred", () => {
      let retval;
      beforeEach(() => {
        retval = linterStatus.afterServerActivating(null);
      });
      it("returns true", () => {
        assert(retval === true);
      });
      it("sets serverActive to true", () => {
        assert(linterStatus.serverActive === true);
      });
      it("sets active to true", () => {
        assert(linterStatus.active === true);
      });
    });
  });

  describe("#afterClientActivating()", () => {
    it("sets clientActive to true", () => {
      linterStatus.afterClientActivating();
      assert(linterStatus.clientActive === true);
    });
  });

  describe("#beforeLintingText()", () => {
    beforeEach(() => {
      linterStatus.beforeLintingText();
    });
    it("sets linting to true", () => {
      assert(linterStatus.linting === true);
    });
    it("sets waiting to true", () => {
      assert(linterStatus.waiting === true);
    });
  });

  describe("#afterServerLintingText()", () => {
    context("when error is occurred", () => {
      let retval;
      beforeEach(() => {
        linterStatus.beforeLintingText();
        retval = linterStatus.afterServerLintingText("Test error");
      });
      it("returns false", () => {
        assert(retval === false);
      });
      it("sets serverLinted to false", () => {
        assert(linterStatus.serverLinted === false);
      });
      it("sets back linting to false", () => {
        assert(linterStatus.linting === false);
      });
      it("sets back waiting to false", () => {
        assert(linterStatus.waiting === false);
      });
    });
    context("when error is not occurred", () => {
      let retval;
      beforeEach(() => {
        linterStatus.beforeLintingText();
        retval = linterStatus.afterServerLintingText(null);
      });
      it("returns true", () => {
        assert(retval === true);
      });
      it("sets serverLinted to true", () => {
        assert(linterStatus.serverLinted === true);
      });
      it("sets back linting to false", () => {
        assert(linterStatus.linting === false);
      });
      it("sets back waiting to false", () => {
        assert(linterStatus.waiting === false);
      });
    });
    context("when multiple linting is running", () => {
      it("keeps linting true until all linting finishes", () => {
        linterStatus.beforeLintingText();
        linterStatus.beforeLintingText();
        assert(linterStatus.linting === true);
        linterStatus.afterServerLintingText(null);
        assert(linterStatus.linting === true);
        linterStatus.afterServerLintingText(null);
        assert(linterStatus.linting === false);
      });
    });
  });

  describe("#afterClientLintingText()", () => {
    beforeEach(() => {
      linterStatus.afterClientLintingText();
    });
    it("sets clientLinted to true", () => {
      assert(linterStatus.clientLinted === true);
    });
  });

  describe("#beforeCorrectingText", () => {
    beforeEach(() => {
      linterStatus.beforeCorrectingText();
    });
    it("sets correcting to true", () => {
      assert(linterStatus.correcting === true);
    });
    it("sets waiting to true", () => {
      assert(linterStatus.waiting === true);
    });
  });

  describe("#afterServerCorrectingText()", () => {
    context("when error is occurred", () => {
      let retval;
      beforeEach(() => {
        linterStatus.beforeCorrectingText();
        retval = linterStatus.afterServerCorrectingText("Test error");
      });
      it("returns false", () => {
        assert(retval === false);
      });
      it("sets back correcting to false", () => {
        assert(linterStatus.correcting === false);
      });
      it("sets back waiting to false", () => {
        assert(linterStatus.waiting === false);
      });
    });
    context("when error is not occurred", () => {
      let retval;
      beforeEach(() => {
        linterStatus.beforeCorrectingText();
        retval = linterStatus.afterServerCorrectingText(null);
      });
      it("returns true", () => {
        assert(retval === true);
      });
      it("sets back correcting to false", () => {
        assert(linterStatus.correcting === false);
      });
      it("sets back waiting to false", () => {
        assert(linterStatus.waiting === false);
      });
    });
    context("when multiple correcting is running", () => {
      it("keeps correcting true until all correcting finishes", () => {
        linterStatus.beforeCorrectingText();
        linterStatus.beforeCorrectingText();
        assert(linterStatus.correcting === true);
        linterStatus.afterServerCorrectingText(null);
        assert(linterStatus.correcting === true);
        linterStatus.afterServerCorrectingText(null);
        assert(linterStatus.correcting === false);
      });
    });
  });

  describe("#afterClientCorrectingText()", () => {
    beforeEach(() => {
      linterStatus.afterClientCorrectingText();
    });
    it("does nothing", () => {
      assert(linterStatus.correcting === false);
    });
  });

  describe("#isUsingCustomRule()", () => {
    context("when using custom rule", () => {
      beforeEach(() => {
        linterStatus.beforeActivating({ name: "Custom" }, "md");
      });
      it("returns true", () => {
        assert(linterStatus.isUsingCustomRule() === true);
      });
    });
    context("when not using custom rule", () => {
      beforeEach(() => {
        linterStatus.beforeActivating({ name: "English" }, "md");
      });
      it("returns false", () => {
        assert(linterStatus.isUsingCustomRule() === false);
      });
    });
  });
});
