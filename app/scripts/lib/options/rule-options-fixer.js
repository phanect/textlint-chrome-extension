/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";

export default {
  fixOptionsForEditor(options) {
    if (_.isObject(options)) {
      // Special treatment for rules that contain "." (dot) for property name
      options = _.mapKeys(options, (val, key) => key.replace(/\./g, "．"));

      // Remove `severity` from child values
      _.each(options, (option, key) => {
        if (_.isObject(option) && option.hasOwnProperty("severity")) {
          delete option.severity;
          if (_.isEmpty(option)) {
            options[key] = true;
          }
        }
      });

      // Remove `severity` from root
      delete options.severity;
      if (_.isEmpty(options)) {
        return true;
      }
    }
    return options;
  },

  fixOptionsForStorage(options, ruleKey, severity) {
    if (options === true) {
      // Change it to an empty Object to set `severity` field
      options = {};
    }
    if (_.isObject(options)) {
      // Special treatment for rules that contain "." (dot) for property name
      options = _.mapKeys(options, (val, key) => key.replace(/．/g, "."));

      // If rule is a preset, we should set severity to each subrule options
      if (/^preset-/.test(ruleKey)) {
        options = _.mapValues(options, (val, key) => {
          if (val === true) {
            val = {};
          }
          if (_.isObject(val)) {
            val.severity = severity;
          }
          return val;
        });
      } else {
        options.severity = severity;
      }
    }
    return options;
  },
}
