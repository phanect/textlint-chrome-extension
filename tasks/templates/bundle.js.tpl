/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
// This is auto-generated file by `gulp bundle`

/* eslint-disable */
export default {
  get(name) {
    name = "textlint-rule-" + name.replace(/^textlint-rule-/, "");
    return this.bundles[name];
  },
  load(name, cb) {
    name = "textlint-rule-" + name.replace(/^textlint-rule-/, "");
    this.loaders[name].call(null, cb);
  },

  loaders: {
<% _.forEach(rules, function (rule) { %>
    "<%= rule.name %>": (cb) => { require(["<%= rule.name %>"], cb) },
<% }); %>
  },

  textlint:
<%= JSON.stringify(textlintInfo, null, 2).replace(/^/mg, "    ") %>,

  bundles: {
<% _.forEach(rules, function (rule) { %>
    "<%= rule.name %>":
<%= JSON.stringify(rule, null, 2).replace(/^/mg, "      ") %>,
<% }); %>
  }
}
/* eslint-enable */
