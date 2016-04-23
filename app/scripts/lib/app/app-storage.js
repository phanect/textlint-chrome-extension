/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import { storage } from "@io-monad/chrome-util";

const POPUP_SETTINGS = "popupSettings";
const OPTIONS = "options";

export default {
  getPopupSettings() {
    return storage.syncGetValue(POPUP_SETTINGS);
  },
  setPopupSettings(settings) {
    return storage.syncSetValue(POPUP_SETTINGS, settings);
  },
  getOptions() {
    return storage.syncGetValue(OPTIONS);
  },
  setOptions(options) {
    return storage.syncSetValue(OPTIONS, options);
  },

  observeOptionsUpdate(callback) {
    chrome.storage.onChanged.addListener((changes) => {
      if (DEBUG) {
        console.log("Storage updated: ", changes);
      }
      if (changes.options) {
        callback(changes.options);
      }
    });
  },
};
