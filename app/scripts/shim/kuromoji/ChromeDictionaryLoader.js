/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

const DictionaryLoader = require("kuromoji/dist/node/loader/DictionaryLoader");

function ChromeDictionaryLoader(dicPath) {
  DictionaryLoader.call(this, dicPath);
}
ChromeDictionaryLoader.prototype = Object.create(DictionaryLoader.prototype);

ChromeDictionaryLoader.prototype.loadArrayBuffer = function (url, callback) {
  // Strip ".gz" since they are decompressed in dist directory
  url = url.replace(/\.gz$/, "");

  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "arraybuffer";
  xhr.onload = function () {
    if (this.status !== 200) {
      callback(xhr.statusText, null);
    }
    const typedArray = new Uint8Array(this.response);
    callback(null, typedArray.buffer);
  };
  xhr.onerror = function (err) {
    callback(err, null);
  };
  xhr.send();
};

module.exports = ChromeDictionaryLoader;
