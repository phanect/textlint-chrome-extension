/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React, { PropTypes } from "react";
import { translate } from "../../../util/chrome-util";

export default class DismissButton extends React.Component {
  static propTypes = {
    onDismissThisClick: PropTypes.func.isRequired,
    onDismissSameClick: PropTypes.func.isRequired,
  };

  render() {
    const { onDismissThisClick, onDismissSameClick } = this.props;
    return (
      <div className="btn-group mark-dismiss">
        <a href="#" className="mark-item-menu-item" title={translate("dismissIt")}
          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
        >
          <i className="fa fa-bell-slash"></i>
        </a>
        <ul className="dropdown-menu dropdown-menu-right">
          <li>
            <a href="#" className="mark-dismiss-this" onClick={onDismissThisClick}>
              {translate("dismissOnlyThis")}
            </a>
          </li>
          <li>
            <a href="#" className="mark-dismiss-same" onClick={onDismissSameClick}>
              {translate("dismissAllSame")}
            </a>
          </li>
        </ul>
      </div>
    );
  }
}
