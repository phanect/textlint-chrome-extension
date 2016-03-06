"use strict";

import _ from "lodash";

export default {

  withActiveTab(fn) {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs) => { _.each(tabs, fn) }
    );
  },

  openOptionsPage() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      const optionsUrl = chrome.extension.getURL("pages/options.html");
      chrome.tabs.query({ url: optionsUrl }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.update(tabs[0].id, { active: true });
        } else {
          chrome.tabs.create({ url: optionsUrl });
        }
      });
    }
  },

}
