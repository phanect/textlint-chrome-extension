"use strict";

export default function stripDefault(module) {
  return module && module.__esModule ? module["default"] : module;
}
