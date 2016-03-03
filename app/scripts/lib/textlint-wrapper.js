"use strict";

import _ from "lodash";
import TextCaretScanner from "./text-caret-scanner";

const SEVERITY_NAMES = {
  0: "info",
  1: "warning",
  2: "error"
};

let textlint;

function getTextlint() {
  if (!textlint) {
    // Delay load
    textlint = require("textlint").textlint;
    let rule = require("textlint-rule-general-novel-style-ja").default;

    // TODO: Options for switching rules
    textlint.setupRules({
      "general-novel-style-ja": rule
    }, {
      "general-novel-style-ja": {
        // 各段落の先頭に許可する文字
        "chars_leading_paragraph": "#/ 　「『【〈《（(“\"‘'［[〔｛{＜<",
        // 閉じ括弧の手前に句読点(。、)を置かない
        "no_punctuation_at_closing_quote": true,
        // 疑問符(？)と感嘆符(！)の直後にスペースを置く
        "space_after_marks": true,
        // 連続した三点リーダー(…)の数は偶数にする
        "even_number_ellipsises": true,
        // 連続したダッシュ(―)の数は偶数にする
        "even_number_dashes": true,
        // 連続した中黒(・)を許可しない
        "appropriate_use_of_interpunct": true,
        // 連続した長音符(ー)を許可しない
        "appropriate_use_of_choonpu": true,
        // マイナス記号(−)は数字の前にしか許可しない
        "appropriate_use_of_minus_sign": true,
        // アラビア数字の桁数はチェックしない
        "max_arabic_numeral_digits": false
      }
    });
  }
  return textlint;
}

function buildLintMessages(text, messages) {
  let scanner = new TextCaretScanner(text);
  return _.map(messages, (m) => {
    let range = scanner.getWordRangeFromLineColumn(m.line, m.column);
    return {
      "start":    range[0],
      "end":      range[1],
      "message":  m.message,
      "ruleId":   m.ruleId,
      "severity": SEVERITY_NAMES[m.severity] || SEVERITY_NAMES[0]
    };
  });
}

export default {
  lint(text) {
    return new Promise((resolve, reject) => {
      getTextlint().lintText(text)
        .then(({messages}) => {
          let lintMessages = buildLintMessages(text, messages);
          let severityCounts = _.mapValues(_.invert(SEVERITY_NAMES), _.constant(0));
          lintMessages.forEach((m) => { severityCounts[m.severity] += 1 });
          resolve({
            lintMessages: lintMessages,
            severityCounts:  severityCounts
          });
        })
        .catch(reject);
    });
  },
};
