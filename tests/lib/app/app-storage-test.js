/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import appStorage from "../../../app/scripts/lib/app/app-storage";

describe("appStorage", () => {
  const storageOptions = {
    popupSettings: {
      preset: "english",
      format: "md",
    },
    options: {
      showMarks: false,
      showBorder: true,
      badgeCountSeverity: "error,warning",
      ruleOptions: {},
    },
  };

  beforeEach(() => {
    chrome.storage.sync.get.callsArgWith(1, storageOptions);
    chrome.storage.sync.set.callsArg(1);
  });
  function getSetValue() {
    return chrome.storage.sync.set.firstCall.args[0];
  }
  function assertSetValue(newValue) {
    assert(chrome.storage.sync.set.calledOnce);
    assert.deepEqual(getSetValue(), newValue);
  }

  describe("#getPopupSettings()", () => {
    it("gets popup settings from chrome storage", () => {
      return withResolved(appStorage.getPopupSettings(), (resolved) => {
        assert.deepEqual(resolved, storageOptions.popupSettings);
      });
    });
  });

  describe("#setPopupSettings()", () => {
    const newValue = { preset: "japanese", format: "txt" };

    it("sets popup settings to chrome storage", () => {
      return withResolved(appStorage.setPopupSettings(newValue), () => {
        assertSetValue({ popupSettings: newValue });
      });
    });
  });

  describe("#getOptions()", () => {
    it("gets options from chrome storage", () => {
      return withResolved(appStorage.getOptions(), (resolved) => {
        assert.deepEqual(resolved, storageOptions.options);
      });
    });
  });

  describe("#setOptions()", () => {
    const newValue = { showMarks: true };

    it("sets options to chrome storage", () => {
      return withResolved(appStorage.setOptions(newValue), () => {
        assertSetValue({ options: newValue });
      });
    });
  });

  describe("#observeOptionsUpdate()", () => {
    let callback;
    beforeEach(() => {
      callback = sinon.spy();
      appStorage.observeOptionsUpdate(callback);
    });

    it("calls a callback when option is updated", () => {
      chrome.storage.onChanged.trigger({ options: {} }, "sync");
      assert(callback.calledOnce);
    });

    it("passes new options to callback", () => {
      const newOptions = { showMarks: false };
      chrome.storage.onChanged.trigger({ options: newOptions }, "sync");
      assert.deepEqual(callback.firstCall.args[0], newOptions);
    });

    it("ignores updates of other than options", () => {
      chrome.storage.onChanged.trigger({ popupSettings: {} }, "sync");
      assert(!callback.called);
    });
  });
});
