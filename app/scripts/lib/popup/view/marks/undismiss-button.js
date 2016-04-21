/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import React, { PropTypes } from "react";
import { translate } from "../../../util/chrome-util";

export default class UndismissButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  render() {
    return (
      <a href="#" className="mark-item-menu-item mark-undismiss"
        title={translate("undismissIt")} onClick={this.props.onClick}
      >
        <i className="fa fa-bell"></i>
      </a>
    );
  }
}
