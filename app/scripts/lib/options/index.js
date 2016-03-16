/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import $ from "jquery";
import cutil from "../util/chrome-util";
import AppOptions from "../app/app-options";
import bundles from "../app/bundles";

import OptionsEditor from "./options-editor";
import RuleEditor from "./rule-editor";
import VisualEditor from "./visual-editor";

import "../util/i18n-replace";
import "../json-editor/editor-multiselectize";
import "../json-editor/editor-enumconstant";
import "../json-editor/editor-checkboxed-editor";
import "../json-editor/messages";

JSONEditor.defaults.options.theme = "bootstrap3";
JSONEditor.defaults.options.iconlib = "fontawesome4";
JSONEditor.plugins.selectize.enable = true;

export default function () {
  const optionsEditor = new OptionsEditor([
    new RuleEditor(),
    new VisualEditor(),
  ]);

  renderAppVersion();
  fixMailLinks();
  updateBundlesTable();

  AppOptions.load().then((appOptions) => {
    optionsEditor.init(appOptions).then(() => {
      translateLabels();
      $("#save-button").removeClass("disabled").attr("disabled", false);
      $("a[href='#rules']").tab("show");
    });
  });

  $("#save-button").on("click", () => {
    const appOptions = new AppOptions({});
    if (optionsEditor.validate()) {
      optionsEditor.save(appOptions);
      appOptions.save().then(() => {
        DEBUG && console.log("Saved ", appOptions.toObject());
        window.close();
      });
    }
  });
}

function renderAppVersion() {
  const extensionId = chrome.i18n.getMessage("@@extension_id");
  const storeUrl = `https://chrome.google.com/webstore/detail/currently/${extensionId}/reviews`;
  $(".app-version").text(chrome.runtime.getManifest().version);
  $(".store-link").attr("href", storeUrl);
}

function fixMailLinks() {
  $(".mail-link").on("click", function () {
    chrome.tabs.create({ url: this.href }, (tab) => {
      setTimeout(() => { chrome.tabs.remove(tab.id) }, 500);
    });
    return false;
  });
}

function updateBundlesTable() {
  const $tbody = $("#bundles-tbody");
  const bundleList = [bundles.textlint].concat(_.sortBy(bundles.bundles, "name"));
  $tbody.html(
    _.map(bundleList, (bundle) => ($("<tr />")
      .append($("<td />").html($("<a />").attr({ href: bundle.homepage, target: "_blank" }).text(bundle.name)))
      .append($("<td />").text(bundle.version))
      .append($("<td />").text(bundle.author))
      .append($("<td />").html($("<a />").attr({ href: bundle.homepage, target: "_blank" }).text(bundle.license)))
    ))
  );
}

function translateLabels() {
  $("label").contents()
    .filter(function () { return this.nodeType === 3 && !/^\s*$/.test(this.nodeValue); })
    .each(function () {
      const key = _.camelCase("label-" + this.nodeValue).replace(/[^a-zA-Z0-9]+/g, "");
      if (/^label[A-Z][a-zA-Z0-9]+$/.test(key)) {
        this.nodeValue = cutil.translate(key, this.nodeValue);
      }
    });
}
