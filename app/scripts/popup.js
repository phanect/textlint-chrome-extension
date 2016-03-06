"use strict";

import _ from "lodash";
import $ from "jquery";
import messages from "./lib/background/messages";
import storage from "./lib/util/app-storage";
import cutil from "./lib/util/chrome-util";
import textlintPresets from "./lib/util/textlint-presets";
import "./lib/util/i18n-replace";

function updatePresets() {
  $("#presets").html(
    _.map(textlintPresets.presets, (preset) => {
      return $("<label />")
        .attr("for", `preset-item-${preset.name}`)
        .addClass("pure-radio")
        .append(
          $("<input />").attr({
            id: `preset-item-${preset.name}`,
            type: "radio",
            name: "preset",
            value: preset.name
          })
        )
        .append(
          chrome.i18n.getMessage(`preset${preset.name}`)
        );
    })
  );

  const lang = chrome.i18n.getUILanguage();
  const checked = textlintPresets.localeDefault[lang] || textlintPresets.localeDefault["en"];
  $(`#preset-item-${checked}`).attr("checked", true);

  storage.getSelectedPreset().then((selected) => {
    if (selected) {
      $(`#preset-item-${checked}`).attr("checked", false);
      $(`#preset-item-${selected}`).attr("checked", true);
    }
  });
}

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
      $(".presets-area").toggle(!active);
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

$("#activate-button").on("click", () => {
  const selectedPreset = $("#presets input:radio[name=preset]:checked").val();
  if (selectedPreset) {
    storage.setSelectedPreset(selectedPreset).then(() => {
      cutil.withActiveTab((tab) => { messages.toggleLinter(tab.id) });
    });
  }
});

$("#deactivate-button").on("click", () => {
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

updatePresets();
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
