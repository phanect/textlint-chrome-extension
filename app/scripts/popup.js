"use strict";

import _ from "lodash";
import $ from "jquery";
import BackgroundMessages from "./lib/background-messages";

BackgroundMessages.onActiveState(({active}, sender) => {
  $("#activate-button").toggle(!active);
  $("#deactivate-button").toggle(active);
});

$("#activate-button, #deactivate-button").on("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    _.each(tabs, (tab) => { BackgroundMessages.requestToggle(tab.id) });
  });
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  _.each(tabs, (tab) => { BackgroundMessages.requestActiveState(tab.id) });
});
