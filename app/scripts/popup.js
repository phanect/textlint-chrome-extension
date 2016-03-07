"use strict";

import _ from "lodash";
import $ from "jquery";
import messages from "./lib/background/messages";
import storage from "./lib/app/app-storage";
import cutil from "./lib/util/chrome-util";
import textlintConfig from "./lib/textlint/textlint-config";
import "./lib/util/i18n-replace";

function updatePresets() {
  let checkedName = textlintConfig.getDefaultPreset().name;
  storage.getSelectedPreset().then((selected) => {
    checkedName = selected || checkedName;
    $("#presets").html(
      _.map(textlintConfig.presets, (preset) => {
        return $("<div />")
          .addClass("radio")
          .append(
            $("<label />")
            .append(
              $("<input />").attr({
                id: `preset-item-${preset.name}`,
                type: "radio",
                name: "preset",
                value: preset.name,
                checked: checkedName === preset.name
              })
            )
            .append(
              chrome.i18n.getMessage(`preset${preset.name}`)
            )
          );
      })
    );
  });
}

function updateMarks(marks, counts) {
  $("#marks").html(
    _.map(marks, (mark) => {
      return $("<div />")
        .data("markId", mark.markId)
        .attr("title", `[${mark.severity}] ${mark.message} (${mark.ruleId})`)
        .addClass(`mark-item mark-item-${mark.severity}`)
        .append(
          $("<div />")
            .addClass("mark-item-text")
            .text(mark.message)
            .prepend($("<i />").addClass(`icon-${mark.severity}`))
        )
    })
  );
  _.each(counts, (count, severity) => {
    $(`#marks-count-${severity}`).text(count);
  });
}

function updateForTab(tab) {
  chrome.runtime.getBackgroundPage((background) => {
    messages.getStatus(tab.id).then(({active, marks, counts}) => {
      const tl = background.getTextlintForTab(tab.id);
      const status = tl ? tl.getStatus() : { loaded: false, loadingFailed: false, linting: false };

      if (status.loadingFailed) {
        showErrorPage("textlint loading failed");
        return;
      }

      showLinterPage();
      $("#activate-button").toggle(!active);
      $("#deactivate-button").toggle(active);
      $(".presets-area").toggle(!active);
      $(".marks-area").toggle(active);
      $("#loading-marks").toggle(!status.loaded || status.linting);
      $("#any-marks").toggle(status.loaded && !status.linting && marks.length > 0);
      $("#no-marks").toggle(status.loaded && !status.linting && marks.length === 0);
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
  let selected = $("#presets input:radio[name=preset]:checked").val();
  let preset = textlintConfig.getPreset(selected) || textlintConfig.getDefaultPreset();
  storage.setSelectedPreset(preset.name).then(() => {
    chrome.runtime.getBackgroundPage((background) => {
      cutil.withActiveTab((tab) => {
        background.setupTextlintForTab(tab.id, preset);
        messages.toggleLinter(tab.id);
      });
    });
  });
});

$("#deactivate-button").on("click", () => {
  chrome.runtime.getBackgroundPage((background) => {
    cutil.withActiveTab((tab) => {
      background.removeTextlintForTab(tab.id);
      messages.toggleLinter(tab.id);
    });
  });
});

$("#marks-filter input[type=checkbox]").on("change", function () {
  let $marks = $("#marks");
  $("#marks-filter input[type=checkbox]").each(function () {
    $marks.toggleClass(`filter-${this.value}`, !this.checked);
  });
});

$("#marks").on("click", ".mark-item", function () {
  let markId = $(this).data("markId");
  cutil.withActiveTab((tab) => { messages.showMark(tab.id, markId) });
});

$("#refresh-button").on("click", function () {
  $(this).attr("disabled", true).addClass("disabled");
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
  $("#refresh-button").attr("disabled", false).removeClass("disabled");
}

function showErrorPage(reason) {
  $(".page").hide();
  $("#error-page").show();

  if (reason && __ENV__ === "development") {
    $("#error-details").text(reason).show();
  }
}
