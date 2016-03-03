"use strict";

import _ from "lodash";
import $ from "jquery";
import messages from "./lib/background/messages";

messages.onActiveState(({active}, sender) => {
  $("#activate-button").toggle(!active);
  $("#deactivate-button").toggle(active);
});

$("#activate-button, #deactivate-button").on("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    _.each(tabs, (tab) => { messages.requestToggle(tab.id) });
  });
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  _.each(tabs, (tab) => { messages.requestActiveState(tab.id) });
});
