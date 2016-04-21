/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import $ from "jquery";
import "./test-utils/with-promise";

// Global sinon sandbox
global.sinonsb = sinon.sandbox.create();

beforeEach(() => {
  // Reset all status in sinon-chrome
  chrome.flush();
});

afterEach(() => {
  // Restore all sinon stubs, etc.
  global.sinonsb.restore();
});

// Prepare sandbox iframe
$("<iframe />").attr("id", "sandbox").hide().appendTo(document.body);

// Require all test files by webpack
const contextRequire = require.context(".", true, /-test\.js$/);
contextRequire.keys().map(contextRequire);
