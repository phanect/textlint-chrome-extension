import fs from "fs";
import path from "path";
import gutil from "gulp-util";
import _ from "lodash";
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
    rules: isPreset ? buildRulesFromPackageNames(_.keys(info.dependencies))  // eslint-disable-line
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
  const rules = buildRulesFromPackageNames(getBundledRuleNames());
  const promises = _.map(rules, (rule) => textlintRegistry.getSchema(rule.name));

  return Promise.all(promises).then((schemas) => {
    _.each(schemas, (schema, index) => { rules[index].schema = schema; });
    return rules;
  });
}

function getBundles() {
  return Promise.all([
    getBundledTextlint(),
    getBundledRules(),
  ]).then(([textlintInfo, rules]) => {
    return {
      textlintInfo,
      rules,
    };
  });
}

function getBundleJS(options = {}) {
  const { empty } = options;
  if (empty) {
    return getBundledTextlint().then((textlintInfo) => {
      return renderTemplate({ textlintInfo, rules: [] });
    });
  } else {
    return getBundles().then(({ textlintInfo, rules }) => {
      return renderTemplate({ textlintInfo, rules });
    });
  }
}

export default function bundlejs(fileName, options = {}) {
  const stream = through.obj();
  return getBundleJS(options).then((content) => {
    stream.push(new gutil.File({
      path: fileName,
      contents: new Buffer(content),
    }));
    stream.push(null); // EOF
    return Promise.resolve(stream)
  }).catch((err) => {
    gutil.log(gutil.colors.red(
      `Error while building ${fileName}:`, (err.message || err)
    ));
    stream.emit("error", err);
    return Promise.resolve(stream);
  });
}
