"use strict";

import _ from "lodash";
import $ from "jquery";
import messages from "./lib/background/messages";
import appStorage from "./lib/app/app-storage";
import bundles from "./lib/app/bundles";
import cutil from "./lib/util/chrome-util";
import textlintConfig from "./lib/textlint/textlint-config";
import "./lib/util/i18n-replace";

const $settingsForm = $("#settings-form");
const $presets = $("#presets");
const $presetItemTemplate = $(".preset-item.template").remove().removeClass("template");
const $marks = $("#marks");
const $markItemTemplate = $(".mark-item.template").remove().removeClass("template");

function updateSettings() {
  appStorage.getPopupSettings().then((settings) => {
    const {preset, format} = settings || {};
    updatePresets(preset);
    updateFormats(format);
  });
}

function updatePresets(selectedPreset) {
  textlintConfig.getDefaultPreset().then((defPreset) => {
    const checkedName = selectedPreset || defPreset.name;
    $presets.empty();
    _.each(textlintConfig.presets, (preset) => {
      const $item = $presetItemTemplate.clone(false);
      $item.find(".preset-item-name").text(cutil.translate(`preset${preset.name}`));
      $item.find(".preset-item-radio").attr({
        id: `preset-item-${preset.name}`,
        value: preset.name,
        checked: checkedName === preset.name
      });
      $item.appendTo($presets);
    });
  });
}

function updateFormats(selectedFormat) {
  selectedFormat = selectedFormat || "txt";
  $("#markdown-checkbox").attr("checked", selectedFormat === "md");
}

function updateMarks(marks, counts) {
  $marks.empty();
  _.each(marks, (mark) => {
    const $item = $markItemTemplate.clone(false);
    const rule = bundles.get(mark.ruleId);
    $item.data("markId", mark.markId)
    $item.attr("title", `[${mark.severity}] ${mark.message} (${mark.ruleId})`)
    $item.addClass(`mark-item-${mark.severity}`)

    $item.find(".mark-message").text(mark.message);
    $item.find(".mark-severity").addClass(`icon-${mark.severity}`);
    $item.find(".mark-rule").text(mark.ruleId);
    $item.find(".mark-link").attr("href", rule && rule.homepage ? rule.homepage : "#");
    $item.appendTo($marks);
  });
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
      $(".settings-area").toggle(!active);
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
  sendResponse();
});

$("#options-button").on("click", () => {
  cutil.openOptionsPage();
});

$("#activate-button").on("click", () => {
  const preset = $settingsForm.find("[name=preset]:checked").val();
  const format = $settingsForm.find("[name=format]:checked").val() || "txt";
  const settings = { preset: preset, format: format };
  appStorage.setPopupSettings(settings).then(() => {
    chrome.runtime.getBackgroundPage((background) => {
      cutil.withActiveTab((tab) => {
        background.setupTextlintForTab(tab.id, preset, format).then(() => {
          messages.toggleLinter(tab.id);
        });
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
  $("#marks-filter input[type=checkbox]").each(function () {
    $marks.toggleClass(`filter-${this.value}`, !this.checked);
  });
});

$marks.on("click", ".mark-item", function () {
  let markId = $(this).data("markId");
  cutil.withActiveTab((tab) => { messages.showMark(tab.id, markId) });
});

$("#refresh-button").on("click", function () {
  $(this).attr("disabled", true).addClass("disabled");
  cutil.withActiveTab((tab) => { chrome.tabs.reload(tab.id) });
});

updateSettings();
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
