"use strict";

import _ from "lodash";
import $ from "jquery";
import "./textarea-marker";

const LINT_DELAY = 1000;
const CLASS_PREFIX = "ext-textlint-";

// Page-global tooltip for showing hints from TextareaLinter.
class TextareaLinterTooltip {
  constructor() {
    this.$tooltip = null;
  }

  init() {
    if (!this.$tooltip) {
      this.$tooltip = $("<div />")
        .addClass(`${CLASS_PREFIX}tooltip`)
        .hide()
        .appendTo(document.body);
    }
  }

  show(pageX, pageY) {
    if (!this.$tooltip) return;
    let tx = pageX + 20, ty = pageY + 20;
    let tw = this.$tooltip.outerWidth(), th = this.$tooltip.outerHeight();
    let $w = $(window);
    if (tx + tw + 60 > $w.scrollLeft() + $w.width()) {
      tx = pageX - tw - 20;
    }
    if (ty + th + 60 > $w.scrollTop() + $w.height()) {
      ty = pageY - th - 20;
    }
    this.$tooltip.css({ "left": tx, "top": ty }).show();
  }

  hide() {
    if (this.$tooltip) {
      this.$tooltip.hide();
    }
  }

  update(marks) {
    this.init();
    let combinedMarkId = _.map(marks, "markId").join("-");
    if (this.$tooltip.data("markId") != combinedMarkId) {
      this.$tooltip.data("markId", combinedMarkId);
      this.$tooltip.html(
        _.map(marks, (mark) => this._buildItemByMark(mark))
      );
      this.$tooltip.fadeIn("fast");
    }
  }

  _buildItemByMark(mark) {
    return $("<div />")
      .addClass(`${CLASS_PREFIX}tooltip-item`)
      .addClass(`${CLASS_PREFIX}${mark.severity}`)
      .append(
        $("<span />")
          .addClass(`${CLASS_PREFIX}tooltip-text`)
          .text(mark.message)
          .prepend(
            $("<span />")
              .addClass(`${CLASS_PREFIX}icon-${mark.severity}`)
          )
      )
      .append(
        $("<span />")
          .addClass(`${CLASS_PREFIX}tooltip-rule`)
          .text(mark.ruleId)
      );
  }
}

const DEFAULT_OPTIONS = {
  // Actual linting text method
  lintText: (lintId, text) => {},

  // Actual correcting text method
  correctText: (correctId, text) => {},

  // Event handler called when lint marks is changed.
  onMarksChanged: null,

  // Show markers for highlighting words in textarea
  showMarks: true,

  // Highlight textarea border to show linting status
  showBorder: true,
};

// Page-global linter for textarea content.
// It shows results by highlighting words in textarea,
// and also shows tooltips on mouseover them.
export class TextareaLinter {
  constructor(options) {
    this.options = _.extend({}, DEFAULT_OPTIONS, options);
    this.active = false;
    this.lintedTextArea = null;
    this.tooltip = new TextareaLinterTooltip();
  }

  toggle() {
    if (this.active) {
      this.deactivate();
    } else {
      this.activate();
    }
  }

  setOptions(options) {
    _.extend(this.options, options);
    if (this.active && this.lintedTextArea) {
      this.lintTextArea(this.lintedTextArea);
    }
  }

  activate() {
    if (this.active) return;
    this.active = true;

    // Set global event handlers for textarea
    let self = this;
    $(document).on(
      "input.textareaLinter", "textarea",
      _.debounce(function () {
        self.clearUndos(this);
        self.lintTextArea(this);
      }, LINT_DELAY)
    );
    $(document).on(
      "focusin.textareaLinter", "textarea",
      function () { self.lintTextArea(this) }
    );
  }

  deactivate() {
    if (!this.active) return;
    this.active = false;

    $(document).off("input.textareaLinter", "textarea");
    $(document).off("focusin.textareaLinter", "textarea");

    if (this.lintedTextArea) {
      this.clearUndos(this.lintedTextArea);
      this._hideLintResult(this.lintedTextArea);
      this.lintedTextArea = null;
    }
  }

  lintTextArea(textarea) {
    const textareaId = this._getTextAreaId(textarea);
    const text = textarea.value;

    if (this.lintedTextArea && this.lintedTextArea !== textarea) {
      this.clearUndos(this.lintedTextArea);
      this._hideLintResult(this.lintedTextArea);
    }
    this.lintedTextArea = textarea;

    this.options.lintText(textareaId, text);
  }

  receiveLintResult({lintId, lintResult}) {
    if (this._getTextAreaId(this.lintedTextArea) === lintId) {
      this._showLintResult(this.lintedTextArea, lintResult);
    }
  }

  _showLintResult(textarea, lintResult) {
    const $textarea = $(textarea);
    const text = $(this.lintedTextArea).val();
    const markers = this._buildMarkersFromLintMessages(text, lintResult.messages);

    if ($textarea.textareaMarker("isActive")) {
      $textarea.textareaMarker("setMarkers", markers);
    } else {
      $textarea
        .textareaMarker({
          markers: markers,
          hideOnInput: true,
          classPrefix: CLASS_PREFIX
        })
        .on("markmousemove.extTextlint", (event, $marks) => {
          this.tooltip.update(_.map($marks, (el) => $(el).data()));
          this.tooltip.show(event.pageX, event.pageY);
        })
        .on("markmouseout.extTextlint",  () => {
          this.tooltip.hide();
        })
    }

    const cls = `${CLASS_PREFIX}textarea`;
    $textarea
      .addClass(cls)
      .removeClass(this._prefixedClass(`${cls}-`))
      .addClass(_.uniq(_.map(lintResult.messages, (m) => `${cls}-${m.severity}`)).join(" "))
      .toggleClass(`${cls}-none`, lintResult.messages.length === 0)
      .textareaMarker(this.options.showMarks ? "show" : "hide")
      .toggleClass(`${cls}-show-border`, this.options.showBorder);

    this.tooltip.hide();
    this.options.onMarksChanged && this.options.onMarksChanged.call(textarea);
  }

  _hideLintResult(textarea) {
    $(textarea || this.lintedTextArea)
      .textareaMarker("destroy")
      .off("markmousemove.extTextlint")
      .off("markmouseout.extTextlint")
      .removeClass(this._prefixedClass(CLASS_PREFIX));
    this.tooltip.hide();
    this.options.onMarksChanged && this.options.onMarksChanged.call(textarea);
  }

  _buildMarkersFromLintMessages(text, messages) {
    return _.map(messages || [], (msg) => {
      msg.markId = msg.markId || _.uniqueId("mark");
      return {
        id:    `${CLASS_PREFIX}${msg.markId}`,
        class: `${CLASS_PREFIX}${msg.severity}`,
        start: msg.start,
        end:   msg.end,
        data:  msg,
      };
    });
  }

  getCurrentLintMarks() {
    if (!this.lintedTextArea) return [];
    const $textarea = $(this.lintedTextArea);
    if ($textarea.textareaMarker("isActive")) {
      return _.map(
        $textarea.textareaMarker("markers"),
        (marker) => $(marker).data()
      );
    } else {
      return [];
    }
  }

  getCurrentUndoCount() {
    if (!this.lintedTextArea) return 0;
    const $textarea = $(this.lintedTextArea);
    const undos = $textarea.data("undos");
    return undos ? undos.length : 0;
  }

  showMark(markId) {
    $(this.lintedTextArea)
      .textareaMarker("scrollToMark", `#${CLASS_PREFIX}${markId}`);
  }

  correct() {
    if (this.lintedTextArea) this.correctTextarea(this.lintedTextArea);
  }

  correctTextarea(textarea) {
    const $textarea = $(textarea);
    const textareaId = this._getTextAreaId(textarea);
    const text = textarea.value;

    if ($textarea.data("correcting")) return;
    $textarea.data("correcting", true);
    $textarea.data("lastDisabled", $textarea.attr("disabled"));
    $textarea.attr("disabled", true);
    $textarea.addClass(`${CLASS_PREFIX}textarea-correcting`);

    this._hideLintResult(textarea);
    this.options.correctText(textareaId, text);
  }

  receiveCorrectResult({correctId, correctResult}) {
    if (this._getTextAreaId(this.lintedTextArea) === correctId) {
      this.applyCorrectResult(this.lintedTextArea, correctResult);
    }
  }

  applyCorrectResult(textarea, correctResult) {
    const $textarea = $(textarea);

    if (!$textarea.data("correcting")) return;

    const oldText = $textarea.val();
    const undos = $textarea.data("undos") || [];
    undos.push(oldText);
    $textarea.data("undos", undos);
    $textarea.val(correctResult.output);
    this.lintTextArea(textarea);

    const lastDisabled = $textarea.data("lastDisabled");
    $textarea.attr("disabled", lastDisabled || false);
    $textarea.removeClass(`${CLASS_PREFIX}textarea-correcting`);
    $textarea.removeData(["correcting", "lastDisabled"]);
  }

  undo() {
    if (this.lintedTextArea) this.undoTextarea(this.lintedTextArea);
  }

  undoTextarea(textarea) {
    const $textarea = $(textarea);
    const undos = $textarea.data("undos");
    if (undos && undos.length > 0) {
      const text = undos.pop();
      $textarea.data("undos", undos);
      $textarea.val(text);
      this.lintTextArea(textarea);
    }
  }

  clearUndos(textarea) {
    $(textarea).removeData("undos");
  }

  _getTextAreaId(textarea) {
    let $textarea = $(textarea);
    let textareaId = $textarea.data("textarea-id");
    if (!textareaId) {
      textareaId = _.uniqueId();
      $textarea.data("textarea-id", textareaId);
    }
    return textareaId;
  }

  _prefixedClass(prefix) {
    return (index, classes) => {
      const re = new RegExp(`(^|\\s)${prefix}\\S+`, "g");
      return (classes.match(re) || []).join(" ");
    };
  }
}
