/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import {translate} from "../../../util/chrome-util";
import Paragraph from "./paragraph";

const AuthorSection = React.createClass({
  handleMailClick(e) {
    e.preventDefault();
    chrome.tabs.create({ url: e.target.href }, (tab) => {
      setTimeout(() => { chrome.tabs.remove(tab.id) }, 500);
    });
  },
  render() {
    return (
      <div className="author-section">
        <h2>{translate("contact")}</h2>
        <Paragraph text="aboutS2P1" />
        <Paragraph text="aboutS2P2" />
        <ul className="list-unstyled">
          <li>
            <i className="fa fa-twitter"></i>
            <a href="https://twitter.com/io_monad" target="_blank">
              Twitter: @io_monad
            </a>
          </li>
          <li>
            <i className="fa fa-github"></i>
            <a href="https://github.com/io-monad/textlint-chrome-extension/issues" target="_blank">
              GitHub: io-monad/textlint-chrome-extension
            </a>
          </li>
          <li>
            <i className="fa fa-envelope"></i>
            <a href="mailto:iride.monad@gmail.com" onClick={this.handleMailClick}>
              iride.monad@gmail.com
            </a>
          </li>
        </ul>
      </div>
    );
  }
});

export default AuthorSection;
