/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import { translate } from "../../../util/chrome-util";
import Paragraph from "./paragraph";

const BundlesSection = React.createClass({
  propTypes: {
    bundles: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      version: React.PropTypes.string.isRequired,
      author: React.PropTypes.string.isRequired,
      license: React.PropTypes.string.isRequired,
      homepage: React.PropTypes.string.isRequired,
    })).isRequired,
  },
  render() {
    return (
      <div className="bundles-section">
        <h2>{translate("bundledTextlintAndRules")}</h2>
        <Paragraph text="aboutS4P1" />
        <table className="bundles-table table table-striped">
          <thead>
            <tr>
              <th>{translate("name")}</th>
              <th>{translate("version")}</th>
              <th>{translate("author")}</th>
              <th>{translate("license")}</th>
            </tr>
          </thead>
          <tbody>
            {this.props.bundles.map(bundle =>
              <tr key={bundle.name}>
                <td><a href={bundle.homepage} target="_blank">{bundle.name}</a></td>
                <td>{bundle.version}</td>
                <td>{bundle.author}</td>
                <td><a href={bundle.homepage} target="_blank">{bundle.license}</a></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  },
});

export default BundlesSection;
