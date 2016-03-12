"use strict";

export default class LinterStatus {
  constructor(tabId) {
    this.tabId = tabId;
    this._reset();
  }

  _reset() {
    this.preset = null;
    this.format = null;
    this.lastError = null;
    this.serverActive = false;
    this.clientActive = false;
    this.serverLinted = false;
    this.clientLinted = false;
    this.lintingCount = 0;
    this.correctingCount = 0;
  }

  get active() {
    return this.serverActive || this.clientActive;
  }
  get linting() {
    return this.lintingCount > 0;
  }
  get correcting() {
    return this.correctingCount > 0;
  }
  get waiting() {
    return this.linting || this.correcting;
  }

  setLastError(error) {
    this.lastError = error;
    if (error) {
      console.error("Error:", error);
    }
  }

  beforeActivating(preset, format) {
    this._reset();
    this.preset = preset;
    this.format = format;
  }

  afterServerActivating(error) {
    if (error) {
      this.setLastError(error);
      return false;
    } else {
      this.serverActive = true;
      return true;
    }
  }

  afterClientActivating() {
    this.clientActive = true;
  }

  beforeLintingText() {
    this.lintingCount++;
  }

  afterServerLintingText(error) {
    this.lintingCount--;
    if (error) {
      this.setLastError(error);
      return false;
    } else {
      this.serverLinted = true;
      return true;
    }
  }

  afterClientLintingText() {
    this.clientLinted = true;
  }

  beforeCorrectingText() {
    this.correctingCount++;
  }

  afterServerCorrectingText(error) {
    this.correctingCount--;
    if (error) {
      this.setLastError(error);
      return false;
    }
    return true;
  }

  afterClientCorrectingText() {
    // noop
  }

  isUsingCustomRule() {
    return this.preset && this.preset.name === "Custom";
  }
}
