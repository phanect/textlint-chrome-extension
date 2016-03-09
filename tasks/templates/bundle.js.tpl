// This is auto-generated file by `gulp bundle`
"use strict";

export default {
  get: function (name) {
    return this.bundles[name];
  },
  load: function (name, cb) {
    this.loaders[name].call(null, cb);
  },
  loaders: {
<% _.forEach(rules, function (rule) { %>
    "<%= rule.name %>": (cb) => { require(["<%= rule.name %>"], cb) },
<% }); %>
  },
  bundles: {
<% _.forEach(rules, function (rule) { %>
    "<%= rule.name %>":
<%= JSON.stringify(rule, null, 2).replace(/^/mg, "      ") %>,
<% }); %>
  }
}
