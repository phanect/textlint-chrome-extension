"use strict";

import config from "./config";
import stripDefault from "../util/strip-default";

export default function requireBundle(name) {
  return new Promise((resolve, reject) => {
    const bundle = config.rules[name];
    if (!bundle) {
      return reject(`No such bundled rule: ${name}`);
    }

    let loader = config.bundles[bundle];
    try {
      loader((pkg) => {
        resolve(stripDefault(pkg)[name]);
      });
    } catch (e) {
      reject(e);
    }
  });
}
