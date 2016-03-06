"use strict";

import cutil from "./chrome-util";

const SELECTED_PRESET = "selectedPreset";

export default {
  getSelectedPreset() {
    return cutil.syncGetValue(SELECTED_PRESET);
  },
  setSelectedPreset(presetName) {
    return cutil.syncSetValue(SELECTED_PRESET, presetName);
  },
};
