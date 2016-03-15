/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import $ from "jquery";

$("[data-i18n]").each(function () {
  const key = $(this).data("i18n");
  const translated = chrome.i18n.getMessage(key);
  if (translated) {
    $(this).html(translated);
  } else if (DEBUG) {
    console.error("[i18n-replace] Missing translation: ", key);
  }
});
$("[data-i18n-attr]").each(function () {
  const $this = $(this);
  const table = _.map($this.data("i18n-attr").split(","), (s) => s.split(":", 2));
  const attrs = _.reduce(table, (attrs, pair) => {
    const translated = chrome.i18n.getMessage(pair[1]);
    if (translated) {
      attrs[pair[0]] = translated;
    } else if (DEBUG) {
      console.error("[i18n-replace] Missing translation: ", pair[1]);
    }
    return attrs;
  }, {});
  $this.attr(attrs);
});
