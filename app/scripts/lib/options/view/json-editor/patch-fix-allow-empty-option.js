// Selectize's allowEmptyOption is not working properly
// ref. https://github.com/selectize/selectize.js/issues/739
//
// This is a monkey patch for the issue:
// https://github.com/selectize/selectize.js/issues/739#issuecomment-174144521

/* eslint-disable */
const hashKey = function (value) {
  if (typeof value === "undefined" || value === null) return null;
  if (typeof value === "boolean") return value ? "1" : "0";
  return value + "";
};
$.extend(Selectize.prototype, {
  registerOption(data) {
    const key = hashKey(data[this.settings.valueField]);
    if (typeof key === "undefined" || key === null || this.options.hasOwnProperty(key)) {
      return false;
    }
    data.$order = data.$order || ++this.order;
    this.options[key] = data;
    return key;
  },
});
