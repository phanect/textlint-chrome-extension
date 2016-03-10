"use strict";

import cutil from "../util/chrome-util";

const POPUP_SETTINGS = "popupSettings";
const OPTIONS = "options";

export default {
  getPopupSettings() {
    return cutil.syncGetValue(POPUP_SETTINGS);
  },
  setPopupSettings(settings) {
    return cutil.syncSetValue(POPUP_SETTINGS, settings);
  },
  getOptions() {
    return cutil.syncGetValue(OPTIONS);
  },
  setOptions(options) {
    return cutil.syncSetValue(OPTIONS, options);
  },

  observeOptionsUpdate(callback) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (changes["options"]) {
        callback(changes["options"]);
      }
    });
  },
};
