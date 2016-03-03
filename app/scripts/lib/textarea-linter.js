"use strict";

import _ from "lodash";
import $ from "jquery";
import ContentMessages from "./content-messages";
import "./textarea-marker";

const LINT_DELAY        = 1000;
const CLASS_PREFIX      = "ext-textlint-";
const SEVERITY_TO_CLASS = {
  0: `${CLASS_PREFIX}info`,
  1: `${CLASS_PREFIX}warning`,
  2: `${CLASS_PREFIX}error`,
};

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
    let combinedMarkId = _.map(marks, (mark) => mark["markId"]).join("-");
    if (this.$tooltip.data("markId") != combinedMarkId) {
      this.$tooltip.empty();
      _.each(marks, (mark) => {
        this._buildItemByMark(mark).appendTo(this.$tooltip);
      });
      this.$tooltip.fadeIn("fast");
    }
  }

  _buildItemByMark(mark) {
    return $("<div />")
      .addClass(`${CLASS_PREFIX}tooltip-item ${CLASS_PREFIX}`)
      .addClass(SEVERITY_TO_CLASS[mark["severity"] || 0])
      .append(
        $("<span />")
          .addClass(`${CLASS_PREFIX}tooltip-text`)
          .text(mark["message"])
      )
      .append(
        $("<span />")
          .addClass(`${CLASS_PREFIX}tooltip-rule`)
          .text(mark["ruleId"])
      );
  }
}

// Page-global linter for textarea content.
// It shows results by highlighting words in textarea,
// and also shows tooltips on mouseover them.
export class TextareaLinter {
  constructor() {
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

  activate() {
    if (this.active) return;
    this.active = true;

    // Set global event handler for textarea input or focus
    let self = this;
    $(document).on(
      "input.textareaLinter", "textarea",
      _.debounce(function () { self.lintTextArea(this) }, LINT_DELAY)
    );

    // Lint every textarea that is visible and contains any text
    _($("textarea:visible:enabled")).filter(_.property("value"))
      .each((textarea) => { this.lintTextArea(textarea) })
  }

  deactivate() {
    if (!this.active) return;
    this.active = false;

    $(document).off("input.textareaLinter", "textarea");

    if (this.lintedTextArea) {
      this.hideLintMessages(this.lintedTextArea);
      this.lintedTextArea = null;
    }
  }

  lintTextArea(textarea) {
    const textareaId = this._getTextAreaId(textarea);
    const text = textarea.value;

    if (this.lintedTextArea && this.lintedTextArea !== textarea) {
      this.hideLintMessages(this.lintedTextArea);
    }
    this.lintedTextArea = textarea;

    // Send message to background for requesting textlint it.
    ContentMessages.requestLint(textareaId, text);
  }

  receiveLintResult(textareaId, lintMessages) {
    if (this._getTextAreaId(this.lintedTextArea) == textareaId) {
      this.showLintMessages(this.lintedTextArea, lintMessages);
    }
  }

  showLintMessages(textarea, lintMessages) {
    // Map to hashes for textarea-marker
    let markers = _.map(lintMessages, (msg) => {
      return {
        class: SEVERITY_TO_CLASS[msg.severity] || SEVERITY_TO_CLASS[0],
        start: msg.start,
        end:   msg.end,
        data:  {
          markId:   _.uniqueId("mark"),
          message:  msg.message,
          ruleId:   msg.ruleId,
          severity: msg.severity
        }
      };
    });

    let $textarea = $(textarea);
    if ($textarea.textareaMarker("isActive")) {
      $textarea.textareaMarker("setMarkers", markers);
    } else {
      $textarea.textareaMarker({
        markers: markers,
        hideOnInput: true,
        classPrefix: CLASS_PREFIX
      });
      $textarea
        .on("markmousemove.extTextlint", (event, $marks) => {
          this.tooltip.update(_.map($marks, (el) => $(el).data()));
          this.tooltip.show(event.pageX, event.pageY);
        })
        .on("markmouseout.extTextlint",  () => {
          this.tooltip.hide();
        })
    }
    this.tooltip.hide();
  }

  hideLintMessages(textarea) {
    $(textarea)
      .textareaMarker("destroy")
      .off("markmousemove.extTextlint")
      .off("markmouseout.extTextlint");
    this.tooltip.hide();
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
}
