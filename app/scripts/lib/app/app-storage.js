"use strict";

import cutil from "../util/chrome-util";

const SELECTED_PRESET = "selectedPreset";
const OPTIONS = "options";

export default {
  getSelectedPreset() {
    return cutil.syncGetValue(SELECTED_PRESET);
  },
  setSelectedPreset(presetName) {
    return cutil.syncSetValue(SELECTED_PRESET, presetName);
  },
  getOptions() {
    return cutil.syncGetValue(OPTIONS);
  },
  setOptions(options) {
    return cutil.syncSetValue(OPTIONS, options);
  },
};
