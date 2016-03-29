/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
JSONEditor.defaults.default_language = ((
  typeof chrome.i18n.getUILanguage === "function" &&
  chrome.i18n.getUILanguage() === "ja"
) ? "ja" : "en");
JSONEditor.defaults.language = JSONEditor.defaults.default_language;
JSONEditor.defaults.languages.ja = {
  /**
   * When a property is not set
   */
  error_notset: "プロパティを設定してください",
  /**
   * When a string must not be empty
   */
  error_notempty: "何か入力してください",
  /**
   * When a value is not one of the enumerated values
   */
  error_enum: "指定された値は無効です",
  /**
   * When a value doesn't validate any schema of a 'anyOf' combination
   */
  error_anyOf: "指定された値は無効です",
  /**
   * When a value doesn't validate
   * @variables This key takes one variable: The number of schemas the value does not validate
   */
  error_oneOf: "指定された値は無効です",
  /**
   * When a value does not validate a 'not' schema
   */
  error_not: "指定された値は無効です",
  /**
   * When a value does not match any of the provided types
   */
  error_type_union: "指定された値は無効です",
  /**
   * When a value does not match the given type
   * @variables This key takes one variable: The type the value should be of
   */
  error_type: "指定する値は {{0}} でなければなりません",
  /**
   *  When the value validates one of the disallowed types
   */
  error_disallow_union: "指定された値は無効です",
  /**
   *  When the value validates a disallowed type
   * @variables This key takes one variable: The type the value should not be of
   */
  error_disallow: "指定された値は {{0}} にしてはいけません",
  /**
   * When a value is not a multiple of or divisible by a given number
   * @variables This key takes one variable: The number mentioned above
   */
  error_multipleOf: "{{0}} の倍数である必要があります",
  /**
   * When a value is greater than it's supposed to be (exclusive)
   * @variables This key takes one variable: The maximum
   */
  error_maximum_excl: "{{0}} 未満の数を指定してください",
  /**
   * When a value is greater than it's supposed to be (inclusive
   * @variables This key takes one variable: The maximum
   */
  error_maximum_incl: "{{0}} 以下の数を指定してください",
  /**
   * When a value is lesser than it's supposed to be (exclusive)
   * @variables This key takes one variable: The minimum
   */
  error_minimum_excl: "{{0}} を超える数を指定してください",
  /**
   * When a value is lesser than it's supposed to be (inclusive)
   * @variables This key takes one variable: The minimum
   */
  error_minimum_incl: "{{0}} 以上の数を指定してください",
  /**
   * When a value have too many characters
   * @variables This key takes one variable: The maximum character count
   */
  error_maxLength: "{{0}} 文字以下で入力してください",
  /**
   * When a value does not have enough characters
   * @variables This key takes one variable: The minimum character count
   */
  error_minLength: "{{0}} 文字以上で入力してください",
  /**
   * When a value does not match a given pattern
   */
  error_pattern: "指定された値は無効です",
  /**
   * When an array has additional items whereas it is not supposed to
   */
  error_additionalItems: "追加のアイテムは許可されていません",
  /**
   * When there are to many items in an array
   * @variables This key takes one variable: The maximum item count
   */
  error_maxItems: "{{0}} 個までしか指定できません",
  /**
   * When there are not enough items in an array
   * @variables This key takes one variable: The minimum item count
   */
  error_minItems: "{{0}} 個以上を指定してください",
  /**
   * When an array is supposed to have unique items but has duplicates
   */
  error_uniqueItems: "重複した値があります",
  /**
   * When there are too many properties in an object
   * @variables This key takes one variable: The maximum property count
   */
  error_maxProperties: "{{0}} 個までしか指定できません",
  /**
   * When there are not enough properties in an object
   * @variables This key takes one variable: The minimum property count
   */
  error_minProperties: "{{0}} 個以上を指定してください",
  /**
   * When a required property is not defined
   * @variables This key takes one variable: The name of the missing property
   */
  error_required: "必須項目が入力されていません: {{0}}",
  /**
   * When there is an additional property is set whereas there should be none
   * @variables This key takes one variable: The name of the additional property
   */
  error_additional_properties: "追加のプロパティは指定できません",
  /**
   * When a dependency is not resolved
   * @variables This key takes one variable: The name of the missing property for the dependency
   */
  error_dependency: "Must have property {{0}}",
  /**
   * Text on Delete All buttons
   */
  button_delete_all: "全て削除",
  /**
   * Title on Delete All buttons
   */
  button_delete_all_title: "全て削除",
  /**
    * Text on Delete Last buttons
    * @variable This key takes one variable: The title of object to delete
    */
  button_delete_last: "最後尾を削除",
  /**
    * Title on Delete Last buttons
    * @variable This key takes one variable: The title of object to delete
    */
  button_delete_last_title: "最後尾の {{0}} を削除",
  /**
    * Title on Add Row buttons
    * @variable This key takes one variable: The title of object to add
    */
  button_add_row_title: "追加",
  /**
    * Title on Move Down buttons
    */
  button_move_down_title: "下へ",
  /**
    * Title on Move Up buttons
    */
  button_move_up_title: "上へ",
  /**
    * Title on Delete Row buttons
    * @variable This key takes one variable: The title of object to delete
    */
  button_delete_row_title: "削除",
  /**
    * Title on Delete Row buttons, short version (no parameter with the object title)
    */
  button_delete_row_title_short: "削除",
  /**
    * Title on Collapse buttons
    */
  button_collapse: "折り畳み",
};
