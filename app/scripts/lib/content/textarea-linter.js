"use strict";

import _ from "lodash";
import $ from "jquery";
import "./textarea-marker";

const LINT_DELAY        = 1000;
const CLASS_PREFIX      = "ext-textlint-";

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
      .addClass(`${CLASS_PREFIX}tooltip-item`)
      .addClass(`${CLASS_PREFIX}${mark["severity"]}`)
      .append(
        $("<span />")
          .addClass(`${CLASS_PREFIX}tooltip-text`)
          .text(mark["message"])
          .prepend(
            $("<span />")
              .addClass(`${CLASS_PREFIX}icon-${mark["severity"]}`)
          )
      )
      .append(
        $("<span />")
          .addClass(`${CLASS_PREFIX}tooltip-rule`)
          .text(mark["ruleId"])
      );
  }
}

const DEFAULT_OPTIONS = {
  // Actual linting text method
  // It should be a function that is called with a text string and
  // returns a Promise resolving to lint messages.
  lintText: (text) => Promise.resolve([]),

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
      _.debounce(function () { self.lintTextArea(this) }, LINT_DELAY)
    );
    $(document).on(
      "focusin.textareaLinter", "textarea",
      function () { self.lintTextArea(this) }
    );

    // Lint first textarea that is visible and contains any text
    _($("textarea:visible:enabled")).filter("value").take(1)
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

    this.options.lintText(text).then((lintMessages) => {
      if (this._getTextAreaId(this.lintedTextArea) == textareaId) {
        this.showLintMessages(this.lintedTextArea, lintMessages);
      }
    });
  }

  showLintMessages(textarea, lintMessages) {
    // Map to hashes for textarea-marker
    let markers = _.map(lintMessages, (msg) => {
      let markId = _.uniqueId("mark");
      return {
        id:    `${CLASS_PREFIX}${markId}`,
        class: `${CLASS_PREFIX}${msg.severity}`,
        start: msg.start,
        end:   msg.end,
        data:  {
          markId:   markId,
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
      .addClass(_.uniq(_.map(lintMessages, (m) => `${cls}-${m.severity}`)).join(" "))
      .toggleClass(`${cls}-none`, lintMessages.length === 0)
      .textareaMarker(this.options.showMarks ? "show" : "hide")
      .toggleClass(`${cls}-show-border`, this.options.showBorder);

    this.tooltip.hide();
    this.options.onMarksChanged && this.options.onMarksChanged.call(textarea);
  }

  hideLintMessages(textarea) {
    $(textarea || this.lintedTextArea)
      .textareaMarker("destroy")
      .off("markmousemove.extTextlint")
      .off("markmouseout.extTextlint")
      .removeClass(this._prefixedClass(CLASS_PREFIX));
    this.tooltip.hide();
    this.options.onMarksChanged && this.options.onMarksChanged.call(textarea);
  }

  getCurrentLintMarks() {
    if (!this.lintedTextArea) return [];
    let $textarea = $(this.lintedTextArea);
    if ($textarea.textareaMarker("isActive")) {
      return _.map(
        $textarea.textareaMarker("markers"),
        (marker) => $(marker).data()
      );
    } else {
      return [];
    }
  }

  showMark(markId) {
    $(this.lintedTextArea)
      .textareaMarker("scrollToMark", `#${CLASS_PREFIX}${markId}`);
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
