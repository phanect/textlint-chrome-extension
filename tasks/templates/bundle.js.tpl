// This is auto-generated file by `gulp bundle`
"use strict";

export default {
  get: function (name) {
    name = "textlint-rule-" + name.replace(/^textlint-rule-/, "");
    return this.bundles[name];
  },
  load: function (name, cb) {
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
