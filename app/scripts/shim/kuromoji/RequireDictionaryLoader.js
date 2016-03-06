"use strict";

import zlib from "zlib";

const DictionaryLoader = require("kuromoji/dist/node/loader/DictionaryLoader");
const requireDict = require.context(__dirname + "/../../../../node_modules/kuromoji/dist/dict", false, /\.dat\.gz$/);

function RequireDictionaryLoader() {
  DictionaryLoader.apply(this, [""]);
}
RequireDictionaryLoader.prototype = Object.create(DictionaryLoader.prototype);

RequireDictionaryLoader.prototype.loadArrayBuffer = function (file, callback) {
  let loaded;
  try {
    loaded = requireDict("./" + file);
  } catch (e) {
    return callback(e);
  }

  const buffer = new Buffer(loaded, "base64");
  zlib.gunzip(buffer, (err, decompressed) => {
    if (err) return callback(err);
    callback(null, new Uint8Array(decompressed));
  });
}

module.exports = RequireDictionaryLoader;
