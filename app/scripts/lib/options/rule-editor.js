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
    this.$searchInput = $("#search-input");
    this.$turnOnButton = $("#turn-on-button");
    this.$turnOffButton = $("#turn-off-button");
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
    this.bindEvents();
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
        let options = editor.getValue() || true;

        const $severity = $(`#rule-item-${ruleKey} .rule-severity`);
        if ($severity.is(":visible")) {
          options = _.isObject(options) ? options : {};
          options.severity = $severity.find("input[name=severity]:checked").val();
        }

        ruleOptions[ruleKey] = options;
      }
    });
    appOptions.ruleOptions = ruleOptions;
  }

  bindEvents() {
    this.$searchInput.on("input", () => {
      let search = (this.$searchInput.val() || "").toLowerCase().split(/\s+/);
      search = _.reject(search, _.isEmpty);
      if (search.length === 0) {
        this.$editor.find(".rule-item").removeClass("filtered");
        return;
      }

      _.each(this.$editor.find(".rule-item"), (itemElem) => {
        const $item = $(itemElem);
        const searchString = $item.data("search-string");
        if (_.every(search, (s) => searchString.indexOf(s) >= 0)) {
          $item.removeClass("filtered");
        } else {
          $item.addClass("filtered");
        }
      });
    });

    this.$turnOnButton.on("click", () => {
      this.$editor.find(".rule-enabled:visible").bootstrapSwitch("state", true);
    });
    this.$turnOffButton.on("click", () => {
      this.$editor.find(".rule-enabled:visible").bootstrapSwitch("state", false);
    });
  }

  appendItem(rule, appOptions) {
    const $item = this.$itemTemplate.clone(false);
    const ruleOptions = appOptions.getRuleOption(rule.key);
    const translatedDescription = cutil.translate(`rule-${rule.key}-description`, rule.description);
    const searchString = [
      rule.key,
      rule.author,
      rule.description,
      translatedDescription,
    ].join("\n").toLowerCase();

    $item.data("rule-key", rule.key);
    $item.data("search-string", searchString);
    $item.attr("id", "rule-item-" + rule.key);
    $item.find(".rule-name").text(rule.key);
    $item.find(".rule-description").html(translatedDescription);
    _.each(["version", "author", "license"], (key) => {
      $item.find(`.rule-${key}`).text(rule[key]);
    });
    $item.find(".rule-homepage").attr("href", rule.homepage);

    $item.find(".rule-enabled")
      .attr({
        name: `rules[${rule.key}][enabled]`,
        checked: !!ruleOptions
      })
      .bootstrapSwitch({
        size: "mini",
        onInit: this.onSwitchChange,
        onSwitchChange: this.onSwitchChange,
      });

    if (rule.isPreset) {
      $item.find(".rule-severity").hide();
    } else {
      const severity = (_.isObject(ruleOptions) && ruleOptions.severity) || "error";
      $item.find(`.rule-severity-${severity}`).addClass("active")
        .find("input[name=severity]").attr("checked", true);
    }

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
        const options = appOptions.getRuleOption(rule.key);
        if (_.isObject(options) && options.hasOwnProperty("severity")) delete options.severity;

        const editor = new JSONEditor($item.find(".rule-options")[0], {
          form_name_root: `rules[${rule.key}][options]`,
          schema: schema,
          startval: options,
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
