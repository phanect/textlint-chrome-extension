/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import $ from "jquery";
import React from "react";

const RuleToggle = React.createClass({
  propTypes: {
    enabled: React.PropTypes.bool.isRequired,
    onChange: React.PropTypes.func.isRequired,
  },
  componentDidMount() {
    $(this.refs.checkbox).bootstrapSwitch({
      size: "mini",
      onSwitchChange: (ev, checked) => {
        this.props.onChange(checked);
      },
    });
  },
  componentDidUpdate() {
    $(this.refs.checkbox).bootstrapSwitch("state", this.props.enabled);
  },
  render() {
    return (
      <div className="rule-toggle">
        <input
          type="checkbox" ref="checkbox" name="enabled" value="true"
          defaultChecked={this.props.enabled}
        />
      </div>
    );
  },
});

export default RuleToggle;
