/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import $ from "jquery";
import messages from "../background/messages";
import appStorage from "../app/app-storage";
import bundles from "../app/bundles";
import DismissType from "../content/dismiss-type";
import textlintConfig from "../textlint/textlint-config";
import cutil from "../util/chrome-util";
import "../util/i18n-replace";

export default function () {
  const $settingsForm = $("#settings-form");
  const $presets = $("#presets");
  const $presetItemTemplate = $(".preset-item.template").remove().removeClass("template");
  const $marks = $("#marks");
  const $marksFilters = $("#marks-filter input[type=checkbox]");
  const $markItemTemplate = $(".mark-item.template").remove().removeClass("template");

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
    appStorage.setPopupSettings({ preset, format }).then(() => {
      withLinters((linters) => {
        cutil.withActiveTab((tab) => {
          linters.activate(tab.id, preset, format);
        });
      })
    });
  });

  $("#deactivate-button").on("click", () => {
    withLinters((linters) => {
      cutil.withActiveTab((tab) => {
        linters.deactivate(tab.id);
      });
    });
  });

  $marksFilters.on("change", function () {
    $marksFilters.each(function () {
      $marks.toggleClass(`filter-${this.value}`, !this.checked);
    });
  });

  $("#correct-button").on("click", () => {
    cutil.withActiveTab((tab) => { messages.triggerCorrect(tab.id) });
  });

  $(".undo-button").on("click", () => {
    cutil.withActiveTab((tab) => { messages.undo(tab.id) });
  });

  $marks.on("click", ".mark-item", function (ev) {
    if ($(ev.target).parents(".mark-item-menu").length > 0) return;
    let markId = $(this).data("markId");
    cutil.withActiveTab((tab) => { messages.showMark(tab.id, markId) });
  });

  $marks.on("click", ".mark-dismiss-this", function () {
    let markId = $(this).parents(".mark-item").data("markId");
    cutil.withActiveTab((tab) => { messages.dismissMark(tab.id, markId, DismissType.ONLY_THIS) });
  });

  $marks.on("click", ".mark-dismiss-same", function () {
    let markId = $(this).parents(".mark-item").data("markId");
    cutil.withActiveTab((tab) => { messages.dismissMark(tab.id, markId, DismissType.ALL_SAME) });
  });

  $marks.on("click", ".mark-undismiss", function () {
    let markId = $(this).parents(".mark-item").data("markId");
    cutil.withActiveTab((tab) => { messages.dismissMark(tab.id, markId, DismissType.UNDISMISS) });
  });

  $("#refresh-button").on("click", function () {
    $(this).attr("disabled", true).addClass("disabled");
    cutil.withActiveTab((tab) => { chrome.tabs.reload(tab.id) });
  });

  updateSettings();
  cutil.withActiveTab(updateForTab);


  function withLinters(fn) {
    chrome.runtime.getBackgroundPage((background) => {
      fn(background.linters);
    });
  }

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
    let correctable = false;
    _.each(marks, (mark) => {
      const $item = $markItemTemplate.clone(false);
      const rule = bundles.get(mark.ruleId);
      correctable = mark.correctable || correctable;

      $item.data("markId", mark.markId);
      $item.addClass(`mark-item-${mark.dismissed ? "dismissed" : mark.severity}`);
      $item.toggleClass("mark-item-dismissed", mark.dismissed);

      $item.find(".mark-message").text(mark.message);
      $item.find(".mark-severity").addClass(`icon-${mark.dismissed ? "dismissed" : mark.severity}`);
      $item.find(".mark-correctable").toggle(mark.correctable);
      $item.find(".mark-rule").attr("title", mark.ruleId);
      $item.find(".mark-link").attr("href", rule && rule.homepage ? rule.homepage : "#");
      $item.appendTo($marks);
    });
    $("#correct-button").toggle(correctable);
    _.each(counts, (count, severity) => {
      $(`#marks-count-${severity}`).text(count);
    });
  }

  function updateForTab(tab) {
    withLinters((linters) => {
      messages.getStatus(tab.id).then(({active, marks, counts, undoCount}) => {
        const status = linters.getStatus(tab.id);
        const loading = !status.active || status.waiting;
        const anyMarks = marks.length > 0;

        if (status.lastError) {
          showErrorPage(status.lastError);
          return;
        }

        showLinterPage();
        $("#activate-button").toggle(!active);
        $("#deactivate-button").toggle(active);
        $(".settings-area").toggle(!active);
        $(".marks-area").toggle(active);
        $("#loading-marks").toggle(loading);
        $("#ready").toggle(!loading && !status.clientLinted);
        $("#any-marks").toggle(!loading && status.clientLinted && anyMarks);
        $("#no-marks").toggle(!loading && status.clientLinted && !anyMarks);
        $(".undo-button").toggle(undoCount > 0);
        updateMarks(marks, counts);
      });
    });
  }

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

    if (__ENV__ === "development") {
      $("#error-details").text(reason).show();
    }
  }
}
