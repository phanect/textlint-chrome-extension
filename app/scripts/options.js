"use strict";

import _ from "lodash";
import $ from "jquery";
import cutil from "./lib/util/chrome-util";
import AppOptions from "./lib/app/app-options";

import OptionsEditor from "./lib/options/options-editor";
import RuleEditor from "./lib/options/rule-editor";
import VisualEditor from "./lib/options/visual-editor";

import "./lib/util/i18n-replace";
import "./lib/json-editor/editor-multiselectize";
import "./lib/json-editor/editor-enumconstant";
import "./lib/json-editor/messages";

JSONEditor.defaults.options.theme = "bootstrap3";
JSONEditor.defaults.options.iconlib = "fontawesome4";
JSONEditor.plugins.selectize.enable = true;

const optionsEditor = new OptionsEditor([
  new RuleEditor(),
  new VisualEditor(),
]);

renderAppVersion();

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
      window.close();
    });
  }
});


function renderAppVersion() {
  const extensionId = chrome.i18n.getMessage("@@extension_id");
  const storeUrl = `https://chrome.google.com/webstore/detail/currently/${extensionId}/reviews`;
  $(".app-version").text(chrome.runtime.getManifest().version);
  $(".store-link").attr("href", storeUrl);
}

function translateLabels() {
  $("label").contents()
    .filter(function () { return this.nodeType === 3 && !/^\s*$/.test(this.nodeValue); })
    .each(function () {
      const key = _.camelCase("label-" + this.nodeValue).replace(/[^a-zA-Z0-9]+/g, "");
      this.nodeValue = cutil.translate(key, this.nodeValue);
    });
}
