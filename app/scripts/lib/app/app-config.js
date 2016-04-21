/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

export default {
  activeIcon: {
    "19": "/images/icon-19.png",
    "38": "/images/icon-38.png",
  },
  deactiveIcon: {
    "19": "/images/icon-black-19.png",
    "38": "/images/icon-black-38.png",
  },

  defaultRuleset: {
    en: "English",
    ja: "Japanese",
  },
  rulesets: [
    {
      name: "English",
      rules: [
        "common-misspellings",
        "rousseau",
        "alex",
      ],
      ruleOptions: {
        "common-misspellings": true,
        "rousseau": true,
        "alex": true,
      },
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
      },
    },
    {
      name: "JapaneseNovel",
      rules: [
        "max-ten",
        "no-doubled-joshi",
        "sentence-length",
        "no-start-duplicated-conjunction",
        "general-novel-style-ja",
      ],
      ruleOptions: {
        "max-ten": true,
        "no-doubled-joshi": true,
        "sentence-length": true,
        "no-start-duplicated-conjunction": true,
        "general-novel-style-ja": true,
      },
    },
    {
      name: "Custom",
      rules: [
      ],
      ruleOptions: {
      },
    },
  ],
};
