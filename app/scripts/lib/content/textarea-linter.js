/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";
import $ from "jquery";
import "./textarea-marker";
import DismissType from "./dismiss-type";

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
    let tx = pageX + 20;
    let ty = pageY + 20;
    const tw = this.$tooltip.outerWidth();
    const th = this.$tooltip.outerHeight();
    const $w = $(window);
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
    const combinedMarkId = _.map(marks, "markId").join("-");
    if (this.$tooltip.data("markId") !== combinedMarkId) {
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
  lintText: (lintId, text) => {},  // eslint-disable-line

  // Actual correcting text method
  correctText: (correctId, text) => {}, // eslint-disable-line

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
    this.lastLintResult = null;
    this.dismisses = {};
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
    const self = this;
    $(document).on(
      "input.textareaLinter", "textarea",
      _.debounce(function () {
        self.clearUndos(this);
        self.lintTextArea(this);
      }, LINT_DELAY)
    );
    $(document).on(
      "focusin.textareaLinter", "textarea",
      function () { self.lintTextArea(this); }
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
      this.dismisses = {};
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

  receiveLintResult({ lintId, lintResult }) {
    if (this._getTextAreaId(this.lintedTextArea) === lintId) {
      this._showLintResult(this.lintedTextArea, lintResult);
    }
  }

  _showLintResult(textarea, lintResult) {
    const $textarea = $(textarea);
    const text = $(this.lintedTextArea).val();
    const markers = this._buildMarkersFromLintMessages(text, lintResult.messages);
    this.lastLintResult = lintResult;

    if ($textarea.textareaMarker("isActive")) {
      $textarea.textareaMarker("setMarkers", markers);
    } else {
      $textarea
        .textareaMarker({
          markers,
          hideOnInput: true,
          classPrefix: CLASS_PREFIX,
        })
        .on("markmousemove.extTextlint", (event, $marks) => {
          this.tooltip.update(_.map($marks, (el) => $(el).data()));
          this.tooltip.show(event.pageX, event.pageY);
        })
        .on("markmouseout.extTextlint", () => {
          this.tooltip.hide();
        });
    }

    const severities = _(markers).reject("data.dismissed").map("data.severity").uniq().value();
    const cls = `${CLASS_PREFIX}textarea`;
    $textarea
      .addClass(cls)
      .removeClass(this._prefixedClass(`${cls}-`))
      .addClass(_.map(severities, (sev) => `${cls}-${sev}`).join(" "))
      .toggleClass(`${cls}-none`, severities.length === 0)
      .textareaMarker(this.options.showMarks ? "show" : "hide")
      .toggleClass(`${cls}-show-border`, this.options.showBorder);

    this.tooltip.hide();
    if (this.options.onMarksChanged) this.options.onMarksChanged.call(textarea);
  }

  _refreshCurrentLintResult() {
    if (this.lintedTextArea && this.lastLintResult) {
      this._showLintResult(this.lintedTextArea, this.lastLintResult);
    }
  }

  _hideLintResult(textarea) {
    $(textarea || this.lintedTextArea)
      .textareaMarker("destroy")
      .off("markmousemove.extTextlint")
      .off("markmouseout.extTextlint")
      .removeClass(this._prefixedClass(CLASS_PREFIX));
    this.tooltip.hide();
    if (this.options.onMarksChanged) this.options.onMarksChanged.call(textarea);
  }

  _buildMarkersFromLintMessages(text, messages) {
    return _.map(messages || [], (msg) => {
      msg.markId = msg.markId || _.uniqueId("mark");
      msg.text = text.slice(msg.start, msg.end);
      msg.dismissed = this._isDismissedMark(msg);

      const classNames = [
        `${CLASS_PREFIX}${msg.markId}`,
        `${CLASS_PREFIX}${msg.severity}`,
      ];
      if (msg.dismissed) classNames.push(`${CLASS_PREFIX}dismissed`);

      return {
        class: classNames.join(" "),
        start: msg.start,
        end: msg.end,
        data: msg,
      };
    });
  }

  getCurrentLintMarks(markId = null) {
    if (!this.lintedTextArea) return [];
    const $textarea = $(this.lintedTextArea);
    if ($textarea.textareaMarker("isActive")) {
      let $markers = $textarea.textareaMarker("markers");
      if (markId) $markers = $markers.filter(`.${CLASS_PREFIX}${markId}`);
      return _.map($markers, (marker) => {
        const $marker = $(marker);
        const mark = $marker.data();
        mark.text = $marker.text();
        return mark;
      });
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
      .textareaMarker("scrollToMark", `.${CLASS_PREFIX}${markId}`);
  }

  dismissMark(markId, dismissType) {
    if (!this.lintedTextArea) return;
    _.each(this.getCurrentLintMarks(markId), (mark) => {
      if (dismissType === DismissType.UNDISMISS) {
        _.each([DismissType.ONLY_THIS, DismissType.ALL_SAME], (type) => {
          const key = this._buildDismissKey(mark, type);
          _.unset(this.dismisses, [type, key]);
        });
      } else {
        const key = this._buildDismissKey(mark, dismissType);
        _.set(this.dismisses, [dismissType, key], true);
      }
    });
    this._refreshCurrentLintResult();
  }

  _isDismissedMark(mark) {
    return _.some(this.dismisses, (dict, dismissType) => {
      const key = this._buildDismissKey(mark, dismissType);
      return dict[key];
    });
  }

  _buildDismissKey(mark, dismissType) {
    switch (dismissType) {
      case DismissType.ONLY_THIS:
        return `${mark.severity}:${mark.ruleId}:${mark.message}:${mark.text}`;
      case DismissType.ALL_SAME:
        return `${mark.severity}:${mark.ruleId}:${mark.message}`;
      default:
        throw new Error(`Unknown dismissType: ${dismissType}`);
    }
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

  receiveCorrectResult({ correctId, correctResult }) {
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
    const $textarea = $(textarea);
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
