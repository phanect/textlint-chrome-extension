"use strict";

import zlib from "zlib";

const DictionaryLoader = require("kuromoji/dist/node/loader/DictionaryLoader");

function ChromeDictionaryLoader() {
  DictionaryLoader.call(this, "dict/kuromoji");
}
ChromeDictionaryLoader.prototype = Object.create(DictionaryLoader.prototype);

function getExtensionFile(path) {
  return new Promise((resolve, reject) => {
    chrome.runtime.getPackageDirectoryEntry((root) => {
      root.getFile(path, { create: false }, (entry) => {
        entry.file(resolve, reject);
      });
    });
  });
}

ChromeDictionaryLoader.prototype.loadArrayBuffer = function (path, callback) {
  getExtensionFile(path).then((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = new Buffer(reader.result);
      zlib.gunzip(buffer, (err, decompressed) => {
        if (err) return callback(err);
        callback(null, new Uint8Array(decompressed));
      });
    };
    reader.onerror = () => { callback(reader.error) };
    reader.readAsArrayBuffer(file);
  });
}

module.exports = ChromeDictionaryLoader;
