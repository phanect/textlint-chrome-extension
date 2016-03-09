"use strict";

export default {
  activeIcon: {
    "19": "images/icon-19.png",
    "38": "images/icon-38.png"
  },
  deactiveIcon: {
    "19": "images/icon-black-19.png",
    "38": "images/icon-black-38.png"
  },

  defaultPreset: {
    en: "English",
    ja: "Japanese",
  },
  presets: [
    {
      name: "English",
      rules: [
        "rousseau",
        "alex"
      ],
      ruleOptions: {
        "rousseau": true,
        "alex": true,
      }
    },
    {
      name: "Japanese",
      rules: [
        "max-ten",
        "no-double-negative-ja",
        "no-doubled-joshi",
        "sentence-length",
        "no-start-duplicated-conjunction",
        "spellcheck-tech-word",
        "no-mix-dearu-desumasu",
      ],
      ruleOptions: {
        "max-ten": true,
        "no-double-negative-ja": true,
        "no-doubled-joshi": true,
        "sentence-length": true,
        "no-start-duplicated-conjunction": true,
        "spellcheck-tech-word": true,
        "no-mix-dearu-desumasu": true,
      }
    },
    {
      name: "JapaneseNovel",
      rules: [
        "max-ten",
        "no-doubled-joshi",
        "sentence-length",
        "no-start-duplicated-conjunction",
        "general-novel-style-ja"
      ],
      ruleOptions: {
        "max-ten": true,
        "no-doubled-joshi": true,
        "sentence-length": true,
        "no-start-duplicated-conjunction": true,
        "general-novel-style-ja": true,
      }
    }
  ],
}
