/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import React, { PropTypes } from "react";
import { translate, getVersion, openStorePage } from "@io-monad/chrome-util";

export default class FooterPanel extends React.Component {
  static propTypes = {
    saveEnabled: PropTypes.bool.isRequired,
    onSaveClick: PropTypes.func.isRequired,
  };
  static links = [
    { icon: "twitter", title: "@io_monad", url: "https://twitter.com/io_monad" },
    { icon: "github", title: "@io-monad", url: "https://github.com/io-monad" },
    { icon: "code-fork", title: "Fork me", url: "https://github.com/io-monad/textlint-chrome-extension" },
  ];

  render() {
    const { saveEnabled } = this.props;
    return (
      <div className="footer-panel container-fluid">
        <div className="row">
          <div className="col-xs-9 links-area">
            <span className="app-brand">
              textlint Extension ver <span className="app-version">{getVersion()}</span>
            </span>
            <button onClick={openStorePage} className="btn btn-link btn-sm icon-button">
              <i className="fa fa-star fa-lg"></i>
              Rate me!
            </button>
            {FooterPanel.links.map(link =>
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
  }
}
