/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import appConfig from "../../../app/scripts/lib/app/app-config";

describe("appConfig", () => {
  it("is an exported Object", () => {
    assert(_.isObject(appConfig));
  });
  it("has presets", () => {
    assert(_.isArray(appConfig.presets));
  });
});
