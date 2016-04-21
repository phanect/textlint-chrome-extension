/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import _ from "lodash";
import AppOptions from "../../../app/scripts/lib/app/app-options";
import appStorage from "../../../app/scripts/lib/app/app-storage";

describe("AppOptions", () => {
  let appOptions;
  beforeEach(() => {
    appOptions = new AppOptions();
  });

  describe(".load()", () => {
    beforeEach(() => {
      sinonsb.stub(appStorage, "getOptions")
        .returns(Promise.resolve(undefined));
    });

    it("returns a promise", () => {
      assert(AppOptions.load() instanceof Promise);
    });

    it("resolves to AppOptions instance", () => {
      return AppOptions.load().then(resolved => {
        assert(resolved instanceof AppOptions);
      });
    });
  });

  describe("#get()", () => {
    it("returns value for a key", () => {
      assert(appOptions.get("showMarks") === true);
    });
    it("returns undefined for missing key", () => {
      assert(_.isUndefined(appOptions.get("unexist")));
    });
    it("returns picked options for array keys", () => {
      const got = appOptions.get(["showMarks", "showBorder"]);
      assert.deepEqual(got, { showMarks: true, showBorder: true });
    });
  });

  describe("#set()", () => {
    it("sets given values", () => {
      appOptions.set({ showMarks: false });
      assert(appOptions.get("showMarks") === false);
    });
    it("preserves old values", () => {
      appOptions.set({ showMarks: false });
      appOptions.set({ showBorder: false });
      assert(appOptions.get("showMarks") === false);
    });
  });

  describe("#overwrite()", () => {
    it("sets given values", () => {
      appOptions.overwrite({ showMarks: false });
      assert(appOptions.get("showMarks") === false);
    });
    it("updates old values with default values", () => {
      appOptions.set({ showMarks: false });
      appOptions.overwrite({ showBorder: false });
      assert(appOptions.get("showMarks") === true);
    });
  });

  describe("#toObject()", () => {
    it("returns an Object", () => {
      assert(_.isObject(appOptions.toObject()));
    });
    it("contains updated options", () => {
      appOptions.set({ showMarks: false });
      assert(appOptions.toObject().showMarks === false);
    });
  });

  describe("#contentOptions", () => {
    it("only contains options for content", () => {
      const opts = appOptions.contentOptions;
      assert(!_.has(opts, "ruleOptions"));
    });
  });

  describe("#visualOptionsSchema", () => {
    it("returns JSON Schema", () => {
      const schema = appOptions.visualOptionsSchema;
      assert(schema.type === "object");
      assert(_.isObject(schema.properties));
    });
  });

  describe("#visualOptions", () => {
    it("returns visual options", () => {
      const opts = appOptions.visualOptions;
      assert(_.has(opts, "showMarks"));
      assert(!_.has(opts, "ruleOptions"));
    });
  });

  describe("#visualOptions=", () => {
    it("updates visual options", () => {
      appOptions.visualOptions = { showMarks: false };
      assert(appOptions.get("showMarks") === false);
    });
    it("does not accept unknown options", () => {
      appOptions.visualOptions = { test: true };
      assert(_.isUndefined(appOptions.get("test")));
    });
  });

  describe("#showMarks", () => {
    it("returns showMarks option", () => {
      assert(appOptions.showMarks === true);
    });
  });

  describe("#showMarks=", () => {
    it("updates showMarks option", () => {
      appOptions.showMarks = false;
      assert(appOptions.showMarks === false);
    });
  });

  describe("#showBorder", () => {
    it("returns showBorder option", () => {
      assert(appOptions.showBorder === true);
    });
  });

  describe("#showBorder=", () => {
    it("updates showBorder option", () => {
      appOptions.showBorder = false;
      assert(appOptions.showBorder === false);
    });
  });

  describe("#badgeCountSeverity", () => {
    it("returns badgeCountSeverity option", () => {
      assert.deepEqual(appOptions.badgeCountSeverity, ["error"]);
    });
    it("returns array of severities", () => {
      appOptions.badgeCountSeverity = "error,warning";
      assert.deepEqual(appOptions.badgeCountSeverity, ["error", "warning"]);
    });
  });

  describe("#badgeCountSeverity=", () => {
    it("updates badgeCountSeverity option", () => {
      appOptions.badgeCountSeverity = "none";
      assert.deepEqual(appOptions.badgeCountSeverity, []);
    });
  });

  describe("#getRuleOption()", () => {
    it("returns rule option for given name", () => {
      appOptions.ruleOptions = { "alex": { "severity": "info" } };
      assert.deepEqual(appOptions.getRuleOption("alex"), { "severity": "info" });
    });
    it("omits textlint-rule- prefix", () => {
      appOptions.ruleOptions = { "alex": { "severity": "info" } };
      assert.deepEqual(appOptions.getRuleOption("textlint-rule-alex"), { "severity": "info" });
    });
    it("returns undefined for missing name", () => {
      assert(_.isUndefined(appOptions.getRuleOption("alex")));
    });
  });

  describe("#ruleOptions", () => {
    it("returns an Object", () => {
      assert(_.isObject(appOptions.ruleOptions));
    });
  });

  describe("#ruleOptions=", () => {
    it("updates rule options", () => {
      appOptions.ruleOptions = { "alex": { "severity": "info" } };
      assert(appOptions.ruleOptions.alex.severity === "info");
    });
  });

  describe("#load()", () => {
    const storeOptions = {
      showMarks: false,
      showBorder: false,
      badgeCountSeverity: "none",
      ruleOptions: { alex: { severity: "info" } },
    };

    beforeEach(() => {
      sinonsb.stub(appStorage, "getOptions")
        .returns(Promise.resolve(storeOptions));
    });

    it("loads options from storage", () => {
      return appOptions.load().then(() => {
        assert.deepEqual(appOptions.toObject(), storeOptions);
      });
    });
  });

  describe("#save()", () => {
    let setOptions;
    beforeEach(() => {
      setOptions = sinonsb.stub(appStorage, "setOptions")
        .returns(Promise.resolve());
    });

    it("saves options into storage", () => {
      return appOptions.save().then(() => {
        assert(setOptions.calledOnce);
        assert.deepEqual(setOptions.firstCall.args[0], appOptions.toObject());
      });
    });
  });

  describe("#observeUpdate()", () => {
    let storageMethod;
    let callback;
    beforeEach(() => {
      storageMethod = sinonsb.stub(appStorage, "observeOptionsUpdate");
      callback = sinon.spy();
      appOptions.observeUpdate(callback);
    });
    function getObserver() {
      return storageMethod.firstCall.args[0];
    }

    const updateOptions = { oldValue: { showMarks: true }, newValue: { showMarks: false } };
    function updateStorage() {
      getObserver().call(null, updateOptions);
    }

    it("registers callback to app storage", () => {
      assert(storageMethod.calledOnce);
      assert(_.isFunction(getObserver()));
    });

    it("overwrites options when storage updated", () => {
      updateStorage();
      assert(appOptions.showMarks === false);
    });

    it("calls callback when storage updated", () => {
      updateStorage();
      assert(callback.calledOnce);
      assert.deepEqual(callback.firstCall.args[0], updateOptions);
    });
  });
});
