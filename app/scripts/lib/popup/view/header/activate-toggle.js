/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import IconButton from "../common/icon-button";

const ActivateToggle = React.createClass({
  propTypes: {
    active: React.PropTypes.bool.isRequired,
    onClickActivate: React.PropTypes.func.isRequired,
    onClickDeactivate: React.PropTypes.func.isRequired,
  },
  render() {
    const {active, onClickActivate, onClickDeactivate} = this.props;
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
});

export default ActivateToggle;
