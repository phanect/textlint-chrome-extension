/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import React, { PropTypes } from "react";
import OptionsButton from "./options-button";
import ActivateToggle from "./activate-toggle";

export default class HeaderPanel extends React.Component {
  static propTypes = {
    controller: PropTypes.any.isRequired,
    active: PropTypes.bool.isRequired,
    onActivate: PropTypes.func.isRequired,
    onDeactivate: PropTypes.func.isRequired,
  };

  render() {
    const { active } = this.props;
    return (
      <div className="header-panel row">
        <div className="col-xs-6 header-panel-left">
          <OptionsButton />
        </div>
        <div className="col-xs-6 header-panel-right">
          <ActivateToggle
            active={active}
            onClickActivate={this.props.onActivate}
            onClickDeactivate={this.props.onDeactivate}
          />
        </div>
      </div>
    );
  }
}
