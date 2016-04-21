/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import React, { PropTypes } from "react";
import RuleListEditor from "./rule-list-editor";

export default class RulesPage extends React.Component {
  static propTypes = {
    rules: PropTypes.arrayOf(PropTypes.object).isRequired,
    onReady: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="rule-page">
        <RuleListEditor
          rules={this.props.rules}
          onReady={this.props.onReady}
        />
      </div>
    );
  }
}
