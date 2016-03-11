"use strict";

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
