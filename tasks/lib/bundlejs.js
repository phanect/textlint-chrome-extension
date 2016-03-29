import gutil from "gulp-util";
import _ from "lodash";
import fs from "fs";
import path from "path";
import through from "through2";
import textlintRegistry from "textlint-registry";

const templatePath = path.join(__dirname, "../templates/bundle.js.tpl");

function renderTemplate(vars) {
  const template = _.template(fs.readFileSync(templatePath));
  return template(vars);
}

function getPackageInfo(packageName) {
  const info = require(`${packageName}/package.json`);
  const isPreset = /^textlint-rule-preset-/.test(info.name);
  return {
    name: info.name,
    key: info.name.replace(/^textlint-rule-/, ""),
    version: info.version,
    description: info.description,
    author: _.isObject(info.author) ? info.author.name : info.author,
    license: info.license,
    homepage: info.homepage,
    isPreset,
    rules: isPreset ?
      buildRulesFromPackageNames(_.keys(info.dependencies))  // eslint-disable-line
      : [],
    schema: /* Place holder for textlint-registry */ null,
  };
}

function buildRulesFromPackageNames(packageNames) {
  return _(packageNames)
    .filter((p) => /^textlint-rule-/.test(p) && p !== "textlint-rule-helper")
    .map(getPackageInfo)
    .value();
}

function getBundledTextlint() {
  return Promise.resolve(getPackageInfo("textlint"));
}

function getBundledRuleNames() {
  const meta = require(`${__dirname}/../../package.json`);
  return _.filter(_.keys(meta.devDependencies), (pkg) => /^textlint-rule-/.test(pkg));
}

function getBundledRules() {
  return new Promise((resolve, reject) => {
    const rules = buildRulesFromPackageNames(getBundledRuleNames());
    const promises = _.map(rules, rule => textlintRegistry.getSchema(rule.name));

    Promise.all(promises).then((schemas) => {
      _.each(schemas, (schema, index) => { rules[index].schema = schema; });
      resolve(rules);
    })
    .catch(reject);
  });
}

function getBundles() {
  return new Promise((resolve, reject) => {
    Promise.all([getBundledTextlint(), getBundledRules()])
    .then((resolved) => {
      resolve({
        textlintInfo: resolved[0],
        rules: resolved[1],
      });
    })
    .catch(reject);
  });
}

function getBundleJS(options = {}) {
  const empty = options.empty;
  return new Promise((resolve, reject) => {
    if (empty) {
      getBundledTextlint().then((textlintInfo) => {
        resolve(renderTemplate({ textlintInfo, rules: [] }));
      }).catch(reject);
    } else {
      getBundles().then(({ textlintInfo, rules }) => {
        resolve(renderTemplate({ textlintInfo, rules }));
      }).catch(reject);
    }
  });
}

export default function bundlejs(fileName, options = {}) {
  const stream = through.obj();
  getBundleJS(options).then((content) => {
    stream.push(new gutil.File({
      path: fileName,
      contents: new Buffer(content),
    }));
    stream.push(null); // EOF
  }).catch((err) => {
    gutil.log(gutil.colors.red(
      `Error while building ${fileName}:`, (err.message || err)
    ));
    stream.emit("error", err);
  });
  return stream;
}
