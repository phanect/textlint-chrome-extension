import gulp from 'gulp';
import gutil from 'gulp-util';
import _ from 'lodash';
import {exec} from 'child_process';
import fs from 'fs';
import path from 'path';
import through from 'through2';
import textlintRegistry from 'textlint-registry';

const templatePath = path.join(__dirname, '../templates/bundle.js.tpl');

export default function bundlejs(fileName, options = {}) {
  const stream = through.obj();
  getBundleJS(options).then((content) => {
    stream.push(new gutil.File({
      path: fileName,
      contents: new Buffer(content)
    }));
    stream.push(null); // EOF
  }).catch((err) => {
    stream.emit("error", err);
  });
  return stream;
}

function getBundleJS(options = {}) {
  const empty = options.empty;
  return new Promise((resolve, reject) => {
    if (empty) {
      getBundledTextlint().then((textlintInfo) => {
        resolve(renderTemplate({ textlintInfo, rules: [] }));
      }).catch(reject);
    } else {
      getBundles().then(({textlintInfo, rules}) => {
        resolve(renderTemplate({ textlintInfo, rules }));
      }).catch(reject);
    }
  });
}

function renderTemplate(vars) {
  const template = _.template(fs.readFileSync(templatePath));
  return template(vars);
}

function getBundles() {
  return new Promise((resolve, reject) => {
    Promise.all([getBundledTextlint(), getBundledRules()])
    .then((resolved) => {
      resolve({
        textlintInfo: resolved[0],
        rules: resolved[1]
      });
    })
    .catch(reject);
  });
}

function getBundledTextlint() {
  return Promise.resolve(getPackageInfo('textlint'));
}

function getBundledRules(cb) {
  return new Promise((resolve, reject) => {
    exec('npm --json --depth=1 list', (error, stdout, stderr) => {
      if (error) return reject(error);

      const list = JSON.parse(stdout);
      const bundles = scanDependenciesForRules(list.dependencies);

      Promise.all(_.map(bundles, rule => textlintRegistry.getSchema(rule.name)))
      .then((schemas) => {
        _.each(schemas, (schema, index) => bundles[index].schema = schema);
        resolve(bundles);
      })
      .catch(reject);
    });
  });
}

function getPackageInfo(packageName) {
  const info = require(`${packageName}/package.json`);
  return {
    name: info.name,
    key: info.name.replace(/^textlint-rule-/, ""),
    version: info.version,
    description: info.description,
    author: _.isObject(info.author) ? info.author.name : info.author,
    license: info.license,
    homepage: info.homepage,
    isPreset: false,
    rules: [],
    schema: /* Place holder for textlint-registry */ null,
  };
}

function scanDependenciesForRules(dependencies) {
  return _.reduce(dependencies, (accum, meta, name) => {
    if (/^textlint-rule-/.test(name)) {
      const info = getPackageInfo(name);
      if (/^textlint-rule-preset-/.test(name)) {
        info.isPreset = true;
        info.rules = scanDependenciesForRules(meta.dependencies);
      }
      accum.push(info);
    }
    return accum;
  }, []);
}
