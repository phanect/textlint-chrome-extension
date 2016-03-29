/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import { translate } from "../../../util/chrome-util";

const FooterLinks = [
  { icon: "twitter", title: "@io_monad", url: "https://twitter.com/io_monad" },
  { icon: "github", title: "@io-monad", url: "https://github.com/io-monad" },
  { icon: "code-fork", title: "Fork me", url: "https://github.com/io-monad/textlint-chrome-extension" },
];

const FooterPanel = React.createClass({
  propTypes: {
    appVersion: React.PropTypes.string.isRequired,
    appStoreURL: React.PropTypes.string.isRequired,
    saveEnabled: React.PropTypes.bool.isRequired,
    onSaveClick: React.PropTypes.func.isRequired,
  },
  render() {
    const { appVersion, appStoreURL, saveEnabled } = this.props;
    return (
      <div className="footer-panel container-fluid">
        <div className="row">
          <div className="col-xs-9 links-area">
            <span className="app-brand">
              textlint Extension ver <span className="app-version">{appVersion}</span>
            </span>
            <a href={appStoreURL} target="_blank" className="btn btn-link btn-sm icon-button">
              <i className="fa fa-star fa-lg"></i>
              Rate me!
            </a>
            {FooterLinks.map(link =>
              <a
                key={link.icon} href={link.url} target="_blank"
                className="btn btn-link btn-sm icon-button"
              >
                <i className={`fa fa-${link.icon} fa-lg`}></i>
                {link.title}
              </a>
            )}
          </div>
          <div className="col-xs-3 save-area">
            <button
              className={`btn btn-primary ${saveEnabled ? "" : "disabled"}`}
              disabled={!saveEnabled}
              onClick={this.props.onSaveClick}
            >
              <span>{translate("save")}</span>
            </button>
          </div>
        </div>
      </div>
    );
  },
});

export default FooterPanel;
