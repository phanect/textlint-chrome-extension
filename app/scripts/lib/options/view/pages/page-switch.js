/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import React, { PropTypes } from "react";
import { translate } from "../../../util/chrome-util";

export default class PageSwitch extends React.Component {
  static propTypes = {
    pages: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      menuTitle: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })).isRequired,
    activePage: PropTypes.string,
    onPageChange: PropTypes.func,
  };

  render() {
    const { pages, activePage, onPageChange } = this.props;
    return (
      <ul className="tab-switch nav nav-pills nav-stacked">
        {pages.map(page =>
          <li key={page.name} className={activePage === page.name ? "active" : ""}>
            <a href="#" onClick={(e) => { e.preventDefault(); onPageChange(page.name); }}>
              <i className={`fa fa-${page.icon}`}></i>
              <span>{translate(page.menuTitle)}</span>
            </a>
          </li>
        )}
      </ul>
    );
  }
}
