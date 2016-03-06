"use strict";

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
      }, reject);
    });
  });
}

ChromeDictionaryLoader.prototype.loadArrayBuffer = function (path, callback) {
  // Strip ".gz" since they are decompressed in dist directory
  path = path.replace(/\.gz$/, "");

  getExtensionFile(path).then((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      callback(null, new Uint8Array(reader.result));
    };
    reader.onerror = () => { callback(reader.error) };
    reader.readAsArrayBuffer(file);
  })
  .catch(callback);
}

module.exports = ChromeDictionaryLoader;
