/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import React, { PropTypes } from "react";
import { translate } from "../../../util/chrome-util";
import Paragraph from "./paragraph";

export default class BundlesSection extends React.Component {
  static propTypes = {
    bundles: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      version: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      license: PropTypes.string.isRequired,
      homepage: PropTypes.string.isRequired,
    })).isRequired,
  };

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
  }
}
