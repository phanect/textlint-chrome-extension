/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import _ from "lodash";

function fixOne(schema) {
  if (schema.type === "boolean" && !schema.format) {
    schema.format = "checkbox";
  }
  if (schema.type === "array") {
    schema.options = _.extend(schema.options, {
      "disable_array_reorder": true,
    });
  }
  if (schema.type === "object") {
    schema.options = _.extend(schema.options, {
      "disable_edit_json": true,
      "disable_properties": true,
    });
    if (_.isObject(schema.properties) && schema.properties["1.1.1.本文"]) {
      // Special treatment for textlint-rule-preset-jtf-style
      schema.properties = _.reduce(
        _.keys(schema.properties).sort(),
        (accum, key, index) => {
          // Replace dots to full-width in property keys because json-editor can't handle them
          const newKey = key.replace(/\./g, "．");
          // Add propertyOrder to sort properties by key
          accum[newKey] = _.extend({ propertyOrder: index }, schema.properties[key]);
          return accum;
        }, {}
      );
    }
  }
  if (schema.type === "array" || schema.type === "object") {
    schema.options = _.extend(schema.options, {
      "disable_collapse": true,
    });
  }
  if ((schema.type === "integer" || schema.type === "number") && !schema.format) {
    schema.format = schema.type;
  }
}

function walk(schema) {
  fixOne(schema);
  if (schema.type === "array" && _.isObject(schema.items)) {
    walk(schema.items);
  }
  if (schema.type === "array" && _.isArray(schema.items)) {
    _.each(schema.items, walk);
  }
  if (schema.type === "array" && _.isObject(schema.additionalItems)) {
    walk(schema.additionalItems);
  }
  if (schema.type === "object" && _.isObject(schema.properties)) {
    _.each(schema.properties, walk);
  }
  if (schema.type === "object" && _.isObject(schema.additionalProperties)) {
    walk(schema.additionalProperties);
  }
  if (schema.type === "object" && _.isObject(schema.patternProperties)) {
    _.each(schema.patternProperties, walk);
  }
  if (_.isArray(schema.allOf)) {
    _.each(schema.allOf, walk);
  }
  if (_.isArray(schema.anyOf)) {
    _.each(schema.anyOf, walk);
  }
  if (_.isArray(schema.oneOf)) {
    _.each(schema.oneOf, walk);
  }
  if (_.isObject(schema.not)) {
    walk(schema.not);
  }
  return schema;
}

function fixSchema(root) {
  root = _.clone(root);

  // Strip root oneOf for enability since it is switched by a toggle.
  if (root.oneOf && root.oneOf.length === 2 && root.oneOf[0].type === "boolean") {
    root = root.oneOf[1];
  }
  // Strip severity property since it is switched by selector.
  if (root.type === "object" && root.properties && root.properties["severity"]) {
    delete root.properties["severity"];
    if (_.isEmpty(root.properties)) {
      // There was only severity property.
      return null;
    }
  }
  // Return no schema if there is only enability setting.
  if (root.type === "boolean") {
    return null;
  }

  return walk(root);
}

function fixInput(input) {
  if (_.isObject(input)) {
    if (input.hasOwnProperty("1.1.1.本文")) {
      // Special treatment for textlint-rule-preset-jtf-style
      input = _.reduce(input, (accum, value, key) => {
        if (_.isObject(value) && value.hasOwnProperty("severity")) {
          delete value.severity;
        }
        accum[key.replace(/\./g, "．")] = value;
        return accum;
      }, {});
    } else if (input.hasOwnProperty("severity")) {
      // Remove root severity
      delete input.severity;
    }
  }
  return input;
}

function fixOutput(output, severity) {
  if (_.isObject(output)) {
    if (output.hasOwnProperty("1．1．1．本文")) {
      // Special treatment for textlint-rule-preset-jtf-style
      output = _.reduce(output, (accum, value, key) => {
        if (value === true) value = {};
        if (_.isObject(value)) {
          value.severity = severity;
        }
        accum[key.replace(/．/g, ".")] = value;
        return accum;
      }, {});
    } else {
      output.severity = severity;
    }
  }
  return output;
}

export default {
  fixSchema: fixSchema,
  fixInput: fixInput,
  fixOutput: fixOutput,
}
