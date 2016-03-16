/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import bundles from "../../../tmp/bundle/bundles";

describe("bundles", () => {

  describe("#get()", () => {
    const testInfo = { name: "textlint-rule-test", key: "test" };
    before(() => {
      bundles.bundles["textlint-rule-test"] = testInfo;
    });
    after(() => {
      delete bundles.bundles["textlint-rule-test"];
    });

    it("returns bundle info", () => {
      assert(bundles.get("test") === testInfo);
    });
    it("omits textlint-rule- prefix", () => {
      assert(bundles.get("textlint-rule-test") === testInfo);
    });
  });

  describe("#load()", () => {
    let testLoader;
    before(() => {
      testLoader = sinon.spy();
      bundles.loaders["textlint-rule-test"] = testLoader;
    });
    after(() => {
      delete bundles.loaders["textlint-rule-test"];
    });

    it("calls bundle loader", () => {
      const cb = sinon.spy();
      bundles.load("test", cb);
      assert(testLoader.calledOnce);
      assert(testLoader.firstCall.args[0] === cb);
    });
  });

  describe("#textlint", () => {
    it("is an Object", () => {
      assert(_.isObject(bundles.textlint));
    });
    it("has name, description, author, license and homepage", () => {
      assert(_.isString(bundles.textlint.name));
      assert(_.isString(bundles.textlint.description));
      assert(_.isString(bundles.textlint.author));
      assert(_.isString(bundles.textlint.license));
      assert(_.isString(bundles.textlint.homepage));
    });
  });

});
