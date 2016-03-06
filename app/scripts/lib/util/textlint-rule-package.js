"use strict";

import $ from "jquery";
import requireBundle from "./require-bundle";

const NPM_REGISTRY_URL = "https://registry.npmjs.org/";
const BROWSERIFY_CDN_URL = "https://www.brcdn.org/";
const TEXTLINT_RULE_PREFIX = "textlint-rule-";
const STORAGE_KEY_PREFIX = "textlintRule";
const CACHE_EXPIRE = 3 * 24 * 60 * 60 * 1000;

const isFresh = (timestamp) => {
  return ($.now() - timestamp < CACHE_EXPIRE);
};

export default class TextlintRulePackage {
  constructor(name) {
    this.name = name;
    this.infoCache = null;

    if (this.name.indexOf(TEXTLINT_RULE_PREFIX) === 0) {
      this.name = this.name.slice(TEXTLINT_RULE_PREFIX.length);
    }
    this.packageName = `${TEXTLINT_RULE_PREFIX}${this.name}`;
  }

  getInfo() {
    return new Promise((resolve, reject) => {
      if (this.infoCache && isFresh(this.infoCache.timestamp)) {
        resolve(this.infoCache.info);
        return;
      }

      const cacheKey = `${STORAGE_KEY_PREFIX}_info_${this.name}`;
      chrome.storage.local.get(cacheKey, (prevCache) => {
        if (prevCache[cacheKey] && isFresh(prevCache[cacheKey].timestamp)) {
          resolve(prevCache[cacheKey].info);
          return;
        }

        $.getJSON(`${NPM_REGISTRY_URL}${this.packageName}`)
          .done((info) => {
            this.infoCache = {
              timestamp: $.now(),
              info: info
            };
            chrome.storage.local.set({ [cacheKey]: this.infoCache }, () => {
              resolve(info);
            });
          })
          .fail((xhr, status, error) => { reject(error) })
      });
    });
  }

  getLatestVersion() {
    return new Promise((resolve, reject) => {
      this.getInfo().then((info) => {
        if (info["dist-tags"] && info["dist-tags"]["latest"]) {
          resolve(info["dist-tags"]["latest"]);
        } else {
          reject("No latest version on package info");
        }
      }).catch(reject);
    });
  }

  load(version) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `${BROWSERIFY_CDN_URL}${this.packageName}/${version}`,
        dataType: "script",
        cache: true
      }).done(() => {
        let pkg = window.require(this.packageName);
        resolve(pkg && pkg.__esModule ? pkg["default"] : pkg);
      }).fail((xhr, status, error) => {
        reject(error);
      });
    });
  }

  loadLatest() {
    return new Promise((resolve, reject) => {
      this.getLatestVersion().then((version) => {
        this.load(version).then(resolve, reject);
      }).catch(reject);
    });
  }

  loadBundled() {
    return new Promise((resolve, reject) => {
      let loaded;
      try {
        loaded = requireBundle(this.packageName);
      } catch (e) {
        reject(e);
      }
      resolve(loaded && loaded.__esModule ? loaded["default"] : loaded);
    });
  }

  loadBundledOrLatest() {
    return new Promise((resolve, reject) => {
      this.loadBundled().then((bundled) => {
        if (bundled) {
          resolve(bundled);
        } else {
          this.loadLatest().then(resolve, reject);
        }
      }).catch(reject);
    });
  }
}
