/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

global.withResolved = function (promise, fn) {
  const self = this;
  return new Promise((resolve, reject) => {
    promise
    .then(function () {
      try {
        fn.apply(self, arguments);
      } catch (e) {
        return reject(e);
      }
      resolve();
    })
    .catch(reject);
  });
};

global.withRejected = function (promise, fn) {
  const self = this;
  return new Promise((resolve, reject) => {
    promise
    .then(function () {
      reject('Promise expected to be rejected has been resolved');
    })
    .catch(function () {
      try {
        fn.apply(self, arguments);
      } catch (e) {
        return reject(e);
      }
      resolve();
    });
  });
};
