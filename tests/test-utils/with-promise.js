/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

global.withResolved = function (promise, fn) {
  return new Promise((resolve, reject) => {
    promise
    .then((...args) => {
      try {
        fn.apply(this, args);
      } catch (e) {
        reject(e);
        return;
      }
      resolve();
    })
    .catch(reject);
  });
};

global.withRejected = function (promise, fn) {
  return new Promise((resolve, reject) => {
    promise
    .then(() => {
      reject("Promise expected to be rejected has been resolved");
    })
    .catch((...args) => {
      try {
        fn.apply(this, args);
      } catch (e) {
        reject(e);
        return;
      }
      resolve();
    });
  });
};
