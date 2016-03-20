/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import {translate} from "../../../util/chrome-util";
import RuleListEditor from "./rule-list-editor";

const RulesPage = React.createClass({
  propTypes: {
    rules: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    onReady: React.PropTypes.func.isRequired,
  },
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
});

export default RulesPage;
