/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import path from "path";
import files from "./files";

export function readFileSync(file, options) {
  options = options || {};
  if (typeof options === "string") {
    options = { encoding: options };
  }
  const encoding = options.encoding || null;

  file = path.basename(file);
  if (files[file]) {
    if (encoding) {
      return files[file];
    } else {
      return new Buffer(files[file]);
    }
  } else {
    const err = new Error(`ENOENT: no such file or directory, open '${file}'`);
    err.errno = -2;
    err.code = "ENOENT";
    err.path = file;
    throw err;
  }
}

export function readFile(file, options, callback) {
  setTimeout(() => {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }

    let content;
    try {
      content = readFileSync(file, options);
    } catch (e) {
      callback(e);
      return;
    }
    if (callback) callback(null, content);
  }, 0);
}
