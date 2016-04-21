/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import $ from "jquery";
import React, { PropTypes } from "react";

export default class RuleToggle extends React.Component {
  static propTypes = {
    enabled: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  componentDidMount() {
    $(this.refs.checkbox).bootstrapSwitch({
      size: "mini",
      onSwitchChange: (ev, checked) => {
        this.props.onChange(checked);
      },
    });
  }
  componentDidUpdate() {
    $(this.refs.checkbox).bootstrapSwitch("state", this.props.enabled);
  }

  render() {
    return (
      <div className="rule-toggle">
        <input
          type="checkbox" ref="checkbox" name="enabled" value="true"
          defaultChecked={this.props.enabled}
        />
      </div>
    );
  }
}
