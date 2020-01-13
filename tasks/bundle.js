import fs from "fs";
import path from "path";
import _ from "lodash";
import gulp, { series } from "gulp";
import bundlejs from "./lib/bundlejs";

const AUTO_UPDATE_TAG = "<!-- AutoUpdatedBundledPackages -->";
const AUTO_UPDATE_RE = new RegExp(`${AUTO_UPDATE_TAG}[\\s\\S]*${AUTO_UPDATE_TAG}`);

const bundleJavaScripts = async () => {
  const outPath = path.join(__dirname, "../app/scripts/lib/app");
  return (await bundlejs("bundles.js")).pipe(gulp.dest(outPath));
};

export const bundleTest = async () => {
  const outPath = path.join(__dirname, "../tmp/bundle");
  return (await bundlejs("bundles.js", { empty: true })).pipe(gulp.dest(outPath));
};

const bundleCredits = series(bundleJavaScripts, (done) => {
  const bundles = require("../app/scripts/lib/app/bundles").default;
  let credits = fs.readFileSync("CREDITS.md").toString();
  credits = credits.replace(AUTO_UPDATE_RE, () => {
    let buffer = `${AUTO_UPDATE_TAG}\n`;
    buffer += "| Package Name | Author | License |\n";
    buffer += "| ------------ | ------ | ------- |\n";

    const rules = _.sortBy(_.values(bundles.bundles), "name");
    [bundles.textlint].concat(rules).forEach(pkg => {
      buffer += `| [${pkg.name}](${pkg.homepage}) | ${pkg.author} | ${pkg.license} |\n`;
    });

    buffer += AUTO_UPDATE_TAG;
    return buffer;
  });
  fs.writeFileSync("CREDITS.md", credits);
  done();
});

export const bundle = series(bundleJavaScripts, bundleCredits);
