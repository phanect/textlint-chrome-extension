"use strict";

import $ from "jquery";

$("[data-i18n]").each(function () {
  const translated = chrome.i18n.getMessage($(this).data("i18n"));
  if (translated) $(this).text(translated);
});
