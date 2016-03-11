"use strict";

import _ from "lodash";
import $ from "jquery";
import bundles from "../app/bundles";
import cutil from "../util/chrome-util";
import fixSchema from "../json-editor/fix-schema";

export default class RuleEditor {
  constructor() {
    this.$editor = $("#rule-editor");
    this.$itemTemplate = $(".rule-item.template").remove().removeClass("template");
    this.editors = {};
  }

  init(appOptions) {
    const promises = [];
    _.each(bundles.bundles, (rule) => {
      const $item = this.appendItem(rule, appOptions);
      const promise = this.initEditor($item, rule, appOptions);
      promise.then((editor) => { this.editors[rule.key] = editor });
      promises.push(promise);
    });
    return Promise.all(promises);
  }

  validate() {
    return _.every(this.editors, (editor, ruleKey) => {
      if (this.isRuleEnabled(ruleKey)) {
        if (editor.validate().length > 0) {
          $("a[href='#rules']")
            .one("shown.bs.tab", () => { location.href = "#rule-item-" + ruleKey; })
            .tab("show");
          location.href = "#rule-item-" + ruleKey;
          return false;
        }
      }
      return true;
    });
  }

  save(appOptions) {
    const ruleOptions = {};
    _.each(this.editors, (editor, ruleKey) => {
      if (this.isRuleEnabled(ruleKey)) {
        ruleOptions[ruleKey] = editor.getValue() || true;
      }
    });
    appOptions.ruleOptions = ruleOptions;
  }

  appendItem(rule, appOptions) {
    const $item = this.$itemTemplate.clone(false);

    $item.data("rule-key", rule.key);
    $item.attr("id", "rule-item-" + rule.key);
    $item.find(".rule-name").text(rule.key);
    $item.find(".rule-description").html(
      cutil.translate(`rule-${rule.key}-description`, rule.description)
    );
    _.each(["version", "author", "license"], (key) => {
      $item.find(`.rule-${key}`).text(rule[key]);
    });
    $item.find(".rule-homepage").attr("href", rule.homepage);

    $item.find(".rule-enabled")
      .attr({
        name: `rules[${rule.key}][enabled]`,
        checked: !!appOptions.getRuleOption(rule.key)
      })
      .bootstrapSwitch({
        size: "mini",
        onInit: this.onSwitchChange,
        onSwitchChange: this.onSwitchChange,
      });

    this.$editor.append($item);
    return $item;
  }

  onSwitchChange() {
    const $switch = $(this);
    $switch.parents(".rule-item").toggleClass("disabled", !$switch.is(":checked"));
  }

  initEditor($item, rule, appOptions) {
    const schema = fixSchema(rule.schema);
    if (schema) {
      return new Promise((resolve, reject) => {
        const editor = new JSONEditor($item.find(".rule-options")[0], {
          form_name_root: `rules[${rule.key}][options]`,
          schema: schema,
          startval: appOptions.getRuleOption(rule.key),
        });
        editor.on("ready", () => { resolve(editor) });
      });
    } else {
      // Mocking editor
      return Promise.resolve({
        validate: () => [],
        getValue: () => true,
      });
    }
  }

  isRuleEnabled(ruleKey) {
    return $("#rule-item-" + ruleKey).find(".rule-enabled").is(":checked");
  }
}
