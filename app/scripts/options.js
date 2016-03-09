"use strict";

import _ from "lodash";
import $ from "jquery";
import bundles from "./lib/app/bundles";
import cutil from "./lib/util/chrome-util";
import appStorage from "./lib/app/app-storage";
import AppOptions from "./lib/app/app-options";
import fixSchema from "./lib/json-editor/fix-schema";
import "./lib/util/i18n-replace";
import "./lib/json-editor/editor-multiselectize";
import "./lib/json-editor/editor-enumconstant";
import "./lib/json-editor/messages";

JSONEditor.defaults.options.theme = "bootstrap3";
JSONEditor.defaults.options.iconlib = "fontawesome4";
JSONEditor.plugins.selectize.enable = true;

const editors = {
  visual: null,
  rules: {},
};
const editorPromises = [];
const $ruleItemTemplate = $(".rule-item.template").remove().removeClass("template");
const $ruleEditor = $("#rule-editor");

const extensionId = chrome.i18n.getMessage("@@extension_id");
const storeUrl = `https://chrome.google.com/webstore/detail/currently/${extensionId}/reviews`;
$(".app-version").text(chrome.runtime.getManifest().version);
$(".store-link").attr("href", storeUrl);

appStorage.getOptions().then((options) => {
  const opts = new AppOptions(options);
  _.each(bundles.bundles, (rule) => {
    $ruleEditor.append(buildRuleItem(rule, opts.ruleOptions));
  });

  editorPromises.push(new Promise((resolve, reject) => {
    editors.visual = new JSONEditor($("#visual-editor")[0], {
      form_name_root: "visual",
      schema: fixSchema(opts.visualOptionsSchema),
      startval: opts.visualOptions,
    });
    editors.visual.on("ready", resolve);
  }));

  Promise.all(editorPromises).then(() => {
    $("#save-button").removeClass("disabled").attr("disabled", false);
    editorPromises.length = 0;

    $("label").contents()
      .filter(function () { return this.nodeType === 3 && !/^\s*$/.test(this.nodeValue); })
      .each(function () {
        const key = _.camelCase("label-" + this.nodeValue).replace(/[^a-zA-Z0-9]+/g, "");
        this.nodeValue = cutil.translate(key, this.nodeValue);
      });
  });
});

$("#save-button").on("click", () => {
  const opts = new AppOptions({});

  if (editors.visual.validate().length > 0) {
    $("a[href='#visual']").tab("show");
    return;
  }
  opts.visualOptions = editors.visual.getValue();

  const ruleOptions = {};
  const passed = _.every(editors.rules, (editor, ruleKey) => {
    const $enabled = $("#rule-item-" + ruleKey).find(".rule-enabled");
    if ($enabled.is(":checked")) {
      const errors = editor.validate();
      if (errors.length > 0) {
        console.log("Errors", errors);
        $("a[href='#rules']")
          .one("shown.bs.tab", () => { location.href = "#rule-item-" + ruleKey; })
          .tab("show");
        location.href = "#rule-item-" + ruleKey;
        return false;
      }
      ruleOptions[ruleKey] = editor.getValue() || true;
    }
    return true;
  });
  if (!passed) return;
  opts.ruleOptions = ruleOptions;

  appStorage.setOptions(opts.toObject()).then(() => {
    window.close();
  });
});

function buildRuleItem(rule, ruleOptions) {
  const $item = $ruleItemTemplate.clone(false);
  const ruleKey = rule.name.replace(/^textlint-rule-/, "");
  const options = ruleOptions[ruleKey];

  $item.data("rule-key", ruleKey);
  $item.attr("id", "rule-item-" + ruleKey);
  $item.find(".rule-name").text(cutil.translate(`rule-${ruleKey}-name`, ruleKey));
  $item.find(".rule-description").text(cutil.translate(`rule-${ruleKey}-description`, rule.description));
  _.each(["version", "author", "license"], (key) => {
    $item.find(`.rule-${key}`).text(rule[key]);
  });
  if (rule.homepage) {
    $item.find(".rule-homepage").attr("href", rule.homepage);
  }

  $item.find(".rule-enabled")
    .attr("name", `rules[${ruleKey}][enabled]`)
    .attr("checked", options)
    .bootstrapSwitch({
      size: "mini",
      onInit: updateRuleItem,
      onSwitchChange: updateRuleItem,
    });

  const schema = fixSchema(rule.schema);
  if (schema) {
    const promise = new Promise((resolve, reject) => {
      const editor = new JSONEditor($item.find(".rule-options")[0], {
        form_name_root: `rules[${ruleKey}][options]`,
        schema: schema,
        startval: options,
      });
      editor.on("ready", resolve);
      editors.rules[ruleKey] = editor;
    });
    editorPromises.push(promise);
  } else {
    editors.rules[ruleKey] = {
      validate: () => [],
      getValue: () => true,
    };
  }
  return $item;
}

function updateRuleItem(ev, state) {
  const $switch = $(this);
  $switch.parents(".rule-item").toggleClass("disabled", !$switch.is(":checked"));
}
