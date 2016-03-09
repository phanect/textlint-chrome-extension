import gulp from 'gulp';
import gutil from 'gulp-util';
import _ from 'lodash';
import {exec} from 'child_process';
import path from 'path';
import fs from 'fs';
import textlintRegistry from 'textlint-registry';

function getRulePackageInfo(packageName) {
  const info = require(`${packageName}/package.json`);
  return {
    name: info.name,
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
      const info = getRulePackageInfo(name);
      if (/^textlint-rule-preset-/.test(name)) {
        info.isPreset = true;
        info.rules = scanDependenciesForRules(meta.dependencies);
      }
      accum.push(info);
    }
    return accum;
  }, []);
}

gulp.task('bundle', (cb) => {
  exec('npm --json --depth=1 list', (error, stdout, stderr) => {
    if (error) {
      gutil.log('Error while getting npm list', stderr);
      cb(error);
    }

    const outPath = path.join(__dirname, '../app/scripts/lib/app/bundles.js');
    const templatePath = path.join(__dirname, 'templates/bundle.js.tpl');
    const template = _.template(fs.readFileSync(templatePath));

    const list = JSON.parse(stdout);
    const rules = scanDependenciesForRules(list.dependencies);
    Promise.all(_.map(rules, (rule) => textlintRegistry.getSchema(rule.name)))
    .then((schemas) => {
      _.each(schemas, (schema, index) => rules[index].schema = schema);
      const content = template({ rules: rules });
      fs.writeFile(outPath, content, cb);
    })
    .catch(cb);
  });
});
