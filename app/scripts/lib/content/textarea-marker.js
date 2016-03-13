"use strict";

import _ from "lodash";
import $ from "jquery";

const PLUGIN_NAME = "textareaMarker";

const DEFAULT_OPTIONS = {
  // Markers definition
  //
  //   Format: [
  //     { class: "class-name-for-mark-element",
  //       start: startIndexZeroOrigin,
  //       end:   endIndexZeroOrigin,
  //       data:  { x: x, y: y, ... } },
  //     { ... }
  //   ]
  markers: [],

  // Throttle milliseconds for following textarea changes
  throttle: 20,

  // Prefix for class names
  classPrefix: "textarea-marker-",

  // Activate markers when constructed
  activate: true,

  // Hide markers on textarea input event
  hideOnInput: false
};

// List of styles to be synchronized from textarea to background div.
const SYNCED_STYLES = `
  font-size font-size-adjust font-style font-family font-weight font-kerning
  letter-spacing direction text-align text-indent text-rendering text-transform
  text-justify text-decoration text-orientation text-combine-upright
  line-height line-break word-spacing word-wrap word-break
  margin-left margin-top margin-right margin-bottom
  padding-left padding-top padding-right padding-bottom
  border-left-style border-top-style border-right-style border-bottom-style
  border-left-width border-top-width border-right-width border-bottom-width
  border-radius vertical-align white-space outline-width box-sizing
`.trim().split(/\s+/);

export default class TextareaMarker {
  constructor($textarea, options) {
    this.$textarea = $textarea;
    this.$background = null;
    this.active = false;
    this.positionTimer = null;
    this.oldPosition = null;
    this.options = _.extend({}, DEFAULT_OPTIONS, $textarea.data(), options);
    this.options.markers = this._tidyMarkers(this.options.markers || []);
    if (this.options.activate) {
      this.activate();
    }
  }

  activate() {
    if (this.active) return;
    this.$textarea.data(PLUGIN_NAME, this);
    this._attachBackground();
    this._bindEvents();
    this._syncAll();
    this.show();
    this.active = true;
  }

  deactivate() {
    if (!this.active) return;
    this._unbindEvents();
    this._detachBackground();
    this.active = false;
  }

  show() {
    if (this.$background) {
      this.$background.removeClass(`${this.options.classPrefix}background-hide-marks`);
    }
  }

  hide() {
    if (this.$background) {
      this.$background.addClass(`${this.options.classPrefix}background-hide-marks`);
    }
  }

  destroy() {
    this.deactivate();
    this.$textarea.removeData(PLUGIN_NAME);
    if (this.$background) {
      this.$background = null;
    }
  }

  setOptions(options) {
    this.options = _.extend({}, DEFAULT_OPTIONS, this.$textarea.data(), options);
    this.setMarkers(this.options.markers || []);
  }

  setMarkers(markers) {
    this.options.markers = this._tidyMarkers(markers);
    this._syncContents();
    this.show();
  }

  isActive() {
    return this.active;
  }

  background() {
    return this.$background || $([]);
  }

  markers() {
    return this.$background ? this.$background.find("mark") : $([]);
  }

  scrollToMark(selector) {
    if (!this.$background) return;

    const $marks = this.$background.find(selector);
    if ($marks.length == 0) return;

    const $mark = $marks.first();
    const pos = $mark.position();
    const bgX = this.$background.scrollLeft();
    const bgY = this.$background.scrollTop();
    const centerX = (this.$textarea.innerWidth() - $mark.outerWidth()) / 2;
    const centerY = (this.$textarea.innerHeight() - $mark.outerHeight()) / 2;

    this.$textarea.scrollLeft(Math.max(0, pos.left + bgX - centerX));
    this.$textarea.scrollTop(Math.max(0, pos.top + bgY - centerY));

    // Blink the marks
    for (let i = 0; i < 2; i++) {
      $marks.animate({ "opacity": 0 }, 300).animate({ "opacity": 1 }, 100);
    }
  }

  _attachBackground() {
    if (!this.$background) {
      this.$background = $("<div/>")
        .addClass(`${this.options.classPrefix}background`)
        .css({
          "position": "absolute",
          "color": "transparent",
          "border-color": "transparent",
          "overflow": "hidden",
          "z-index": "auto",
          "background": this.$textarea.css("background")
        });
    }
    this.$background.insertBefore(this.$textarea);

    const cssPosition = this.$textarea.css("position");
    if (cssPosition === "static") {
      this.oldPosition = cssPosition;
      this.$textarea.css("position", "relative");
    }
    this.$textarea.css("background", "none");
  }

  _detachBackground() {
    if (this.$background) {
      this.$textarea.css("background", this.$background.css("background"));

      if (this.oldPosition) {
        this.$textarea.css("position", this.oldPosition);
        this.oldPosition = null;
      }

      this.$background.remove();
    }
  }

  _bindEvents() {
    this.$textarea
      .on(`scroll.${PLUGIN_NAME}`, _.throttle(
        () => { this._syncScrollPositions() },
        this.options.throttle
      ))
      .on(`input.${PLUGIN_NAME}`, _.throttle(
        () => {
          if (this.options.hideOnInput) {
            this.hide();
          } else {
            this._syncContents();
          }
        },
        this.options.throttle
      ))
      .on(`mousemove.${PLUGIN_NAME}`, _.throttle(
        (ev) => { this._detectMouseMoveOnMarker(ev) },
        this.options.throttle
      ))
      .on(`focus.${PLUGIN_NAME} blur.${PLUGIN_NAME}`, () => this._syncAll())

    this.positionTimer = setInterval(() => {
      this._syncSizeAndPosition();
      this._syncScrollPositions();
    }, 500);
  }

  _unbindEvents() {
    this.$textarea
      .off(`scroll.${PLUGIN_NAME} input.${PLUGIN_NAME}`)
      .off(`mousemove.${PLUGIN_NAME}`)
      .off(`focus.${PLUGIN_NAME} blur.${PLUGIN_NAME}`);

    clearInterval(this.positionTimer);
    this.positionTimer = null;
  }

  _syncAll() {
    if (!this.$background) return;
    this._syncStyles();
    this._syncContents();
    this._syncSizeAndPosition();
    this._syncScrollPositions();
  }

  _syncStyles() {
    if (!this.$background) return;
    let styles = this.$textarea.css(SYNCED_STYLES);
    this.$background.css(styles);
    if (styles["line-height"]) {
      // Quickfix for relative line-height
      // css("line-height") returns an absolute value (123px)
      this.$textarea.css("line-height", styles["line-height"]);
    }
  }

  _syncContents() {
    if (!this.$background) return;
    const content = this.$textarea.val();
    const node = this._markupTextToNode(content);
    this.$background.html(node);
  }

  _syncSizeAndPosition() {
    if (!this.$background) return;
    this.$background.width(this.$textarea.width());
    this.$background.height(this.$textarea.height());
    this.$background.css(this.$textarea.position());
  }

  _syncScrollPositions() {
    if (!this.$background) return;
    this.$background.scrollTop(this.$textarea.scrollTop());
    this.$background.scrollLeft(this.$textarea.scrollLeft());
  }

  _tidyMarkers(markers) {
    const newMarkers = [];
    let prev;
    _.each(_.sortBy(markers || [], ["start", "end"]), (marker) => {
      if (prev && marker.start < prev.end && marker.end > prev.env) {
        // Overlapped. We have to split it into two markers
        const inner = _.clone(marker), outer = _.clone(marker);
        inner.end = prev.end;
        outer.start = prev.end;
        newMarkers.push(inner);
        newMarkers.push(outer);
      } else {
        newMarkers.push(marker);
      }
      prev = marker;
    });
    return newMarkers;
  }

  // Mark up text by markers using <mark> elements.
  //
  // Example:
  //   ABCDEFGHIJK
  //      | Marking up BCDEF and CD and IJ
  //   A<mark>B<mark>CD</mark>EF</mark>GH<mark>IJ</mark>K
  //
  // By nesting nodes, we can detect mark elements under
  // the mouse pointer by document.elementsFromPoint(x, y)
  _markupTextToNode(text) {
    let currentNode = document.createDocumentFragment();
    let currentIndex = 0;
    let endIndexStack = [];

    const skipTextUntilIndex = (index) => {
      if (currentIndex != index) {
        let sliced = text.slice(currentIndex, index);
        currentNode.appendChild(document.createTextNode(sliced));
        currentIndex = index;
      }
    };

    const forwardUntilIndex = (index) => {
      while (endIndexStack.length > 0 && endIndexStack[0] <= index) {
        skipTextUntilIndex(endIndexStack[0]);
        currentNode = currentNode.parentNode;
        endIndexStack.shift();
      }
      skipTextUntilIndex(index);
    };

    _.each(this.options.markers, (marker) => {
      forwardUntilIndex(marker.start);

      let markElement = this._createMarkElement(marker);
      currentNode.appendChild(markElement);
      currentNode = markElement;
      endIndexStack.unshift(Math.min(marker.end, text.length));
    });
    forwardUntilIndex(text.length);
    return currentNode;
  }

  _createMarkElement(marker) {
    const $mark = $("<mark/>");
    $mark
      .css("color", "transparent")
      .attr("id", marker.id || _.uniqueId(`${this.options.classPrefix}mark`))
      .addClass(`${this.options.classPrefix}mark`);
    if (marker.class) {
      $mark.addClass(marker.class);
    }
    if (marker.data) {
      $mark.data(marker.data);
    }
    return $mark[0];
  }

  _detectMouseMoveOnMarker(event) {
    if (!this.$background) return;
    let $marks = $(document.elementsFromPoint(event.clientX, event.clientY))
      .filter(`mark.${this.options.classPrefix}mark`);
    if ($marks.length > 0) {
      let ev = $.Event("markmousemove", {
        pageX: event.pageX,
        pageY: event.pageY
      });
      this.$textarea.trigger(ev, [$marks]);
    } else {
      this.$textarea.trigger("markmouseout");
    }
  }
}

$.fn.textareaMarker = function (methodNameOrOptions) {
  let args = arguments;
  let method, options;
  if (_.isString(methodNameOrOptions)) {
    method = methodNameOrOptions;
  } else {
    options = methodNameOrOptions;
  }

  let execute = function () {
    let $this = $(this);
    let instance = $this.data(PLUGIN_NAME);

    if (!instance && method === "destroy") {
      return;
    }
    if (!instance && method === "isActive") {
      return false;
    }

    if (!instance) {
      instance = new TextareaMarker($this, options);
    } else if (options) {
      instance.setOptions(options);
    }

    if (method) {
      return instance[method].apply(instance, _.slice(args, 1));
    }
  };

  if (method === "background" || method === "markers") {
    return _.reduce(this, (jq, el) => jq.add(execute.call(el)), $([]))
  }
  if (method === "isActive") {
    return this.length && execute.call(this[0]);
  }
  return this.each(execute);
};
