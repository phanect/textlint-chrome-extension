import glob from "glob";
import _ from "lodash";

/**
 * Expand glob expressions into individual path strings.
 *
 * Example:
 *
 *    ['test/*']
 * to
 *    [
 *      'test/a.js',
 *      'test/b.js',
 *      'test/c.js'
 *    ]
 *
 * This way we can support browsers that lacks wildcard support
 * in some manifest.json keys.
 *
 * @param  {Object} manifest
 * @return {Object}
 */
export default function expandGlobsFor(keys, cwd) {
  return function (manifest) {
    keys.forEach((key) => {
      if (!manifest[key] || !Array.isArray(manifest[key])) {
        return;
      }

      const expanded = _
        .chain(manifest[key])
        .map((pattern) => glob.sync(pattern, { cwd }))
        .flatten()
        .value();

      manifest[key] = expanded;
    });

    return manifest;
  };
}
