"use strict";

import _ from "lodash";
import $ from "jquery";
import messages from "./lib/background/messages";
import cutil from "./lib/util/chrome-util";
import "./lib/util/i18n-replace";

function updateMarks(marks, counts) {
  $("#marks").html(
    _.map(marks, (mark) => {
      return $("<div />")
        .data("markId", mark.markId)
        .addClass(`mark-item mark-item-${mark.severity}`)
        .append(
          $("<div />")
            .addClass("mark-item-text")
            .text(mark.message)
            .prepend($("<i />").addClass(`icon-${mark.severity}`))
        )
        .append(
          $("<div />")
            .addClass("mark-item-rule")
            .text(mark.ruleId)
        )
    })
  );
  _.each(counts, (count, severity) => {
    $(`#marks-count-${severity}`).text(count);
  });
}

function updateForTab(tab) {
  chrome.runtime.getBackgroundPage((background) => {
    const {loadingFailed, loaded, linting} = background.textlint.getStatus();
    if (loadingFailed) {
      showErrorPage("textlint loading failed");
      return;
    }

    messages.getStatus(tab.id).then(({active, marks, counts}) => {
      showLinterPage();
      $("#activate-button").toggle(!active);
      $("#deactivate-button").toggle(active);
      $(".marks-area").toggle(active);
      $("#loading-marks").toggle(!loaded || linting);
      $("#any-marks").toggle(loaded && !linting && marks.length > 0);
      $("#no-marks").toggle(loaded && !linting && marks.length === 0);
      updateMarks(marks, counts);
    });
  });
}

messages.onError((reason) => {
  showRequireRefreshPage();
});

messages.onUpdateStatus((msg, sender, sendResponse) => {
  if (sender.tab) updateForTab(sender.tab);
});

$("#options-button").on("click", () => {
  cutil.openOptionsPage();
});

$("#activate-button, #deactivate-button").on("click", () => {
  cutil.withActiveTab((tab) => { messages.toggleLinter(tab.id) });
});

$(".marks-filter").on("click", ".marks-filter-item", function () {
  $(this).toggleClass("active");

  let $marks = $("#marks");
  $marks.removeClass("filtering");
  $(".marks-filter .marks-filter-item").each(function () {
    let $this = $(this);
    let severity = $this.data("severity");
    let active = $this.hasClass("active");
    $marks.toggleClass(`filter-${severity}`, active);
    if (active) $marks.addClass("filtering");
  });
});

$("#marks").on("click", ".mark-item", function () {
  let markId = $(this).data("markId");
  cutil.withActiveTab((tab) => { messages.showMark(tab.id, markId) });
});

$("#refresh-button").on("click", function () {
  $(this).attr("disabled", true).addClass("pure-button-disabled");
  cutil.withActiveTab((tab) => { chrome.tabs.reload(tab.id) });
});

cutil.withActiveTab(updateForTab);

function showLinterPage() {
  $(".page").hide();
  $("#linter-page").show();
}

function showRequireRefreshPage() {
  $(".page").hide();
  $("#refresh-page").show();
  $("#refresh-button").attr("disabled", false).removeClass("pure-button-disabled");
}

function showErrorPage(reason) {
  $(".page").hide();
  $("#error-page").show();

  if (reason && __ENV__ === "development") {
    $("#error-details").text(reason).show();
  }
}
