/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import React, { PropTypes } from "react";
import IconButton from "../common/icon-button";

export default class ActivateToggle extends React.Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    onClickActivate: PropTypes.func.isRequired,
    onClickDeactivate: PropTypes.func.isRequired,
  };

  render() {
    const { active, onClickActivate, onClickDeactivate } = this.props;
    return (
      <div className="activate-toggle">
        <IconButton icon="flash"
          label={active ? "deactivate" : "activate"}
          onClick={active ? onClickDeactivate : onClickActivate}
          btn="primary"
          active={active}
        />
      </div>
    );
  }
}
