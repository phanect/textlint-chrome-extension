"use strict";

import _ from "lodash";
import $ from "jquery";
import messages from "./lib/background/messages";

messages.onReceiveStatus(({active, marks}, sender) => {
  $("#activate-button").toggle(!active);
  $("#deactivate-button").toggle(active);

  let $marks = $("#marks");
  $marks.empty();
  _.each(marks, (mark) => {
    $("<div />")
      .data("markId", mark.markId)
      .addClass(`mark-item mark-item-${mark.severity}`)
      .append(
        $("<span />")
          .addClass("mark-item-text")
          .text(mark.message)
      )
      .append(
        $("<span />")
          .addClass("mark-item-rule")
          .text(mark.ruleId)
      )
      .appendTo($marks)
  });
});

$("#activate-button, #deactivate-button").on("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    _.each(tabs, (tab) => { messages.requestToggle(tab.id) });
  });
});

$("#marks").on("click", ".mark-item", function () {
  let $item = $(this);
  let markId = $item.data("markId");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    _.each(tabs, (tab) => { messages.showMark(tab.id, markId); });
  });
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  _.each(tabs, (tab) => { messages.requestStatus(tab.id) });
});
