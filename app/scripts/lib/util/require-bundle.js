"use strict";

// This is just workaround to avoid dynamic require for webpack

export default function requireBundle(name) {
  switch (name) {
    case "textlint-rule-alex": return require("textlint-rule-alex");
    case "textlint-rule-general-novel-style-ja": return require("textlint-rule-general-novel-style-ja");
    case "textlint-rule-rousseau": return require("textlint-rule-rousseau");
    case "textlint-rule-preset-japanese": return require("textlint-rule-preset-japanese");
  }
  return null;
}
