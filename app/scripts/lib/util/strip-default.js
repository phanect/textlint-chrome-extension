/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

export default function stripDefault(module) {
  return module && module.__esModule ? module["default"] : module;
}
