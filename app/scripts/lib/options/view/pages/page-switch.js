/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import { translate } from "../../../util/chrome-util";

const PageSwitch = React.createClass({
  propTypes: {
    pages: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      menuTitle: React.PropTypes.string.isRequired,
      icon: React.PropTypes.string.isRequired,
    })).isRequired,
    activePage: React.PropTypes.string,
    onPageChange: React.PropTypes.func,
  },
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
  },
});

export default PageSwitch;
