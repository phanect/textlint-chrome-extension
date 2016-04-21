/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import React, { PropTypes } from "react";
import { translate } from "../../../util/chrome-util";

export default class SeveritySwitch extends React.Component {
  static propTypes = {
    selected: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
  };
  static severities = [
    { name: "error", title: "showAsErrors" },
    { name: "warning", title: "showAsWarnings" },
    { name: "info", title: "showAsInfo" },
  ];

  render() {
    const { selected, onSelect } = this.props;
    return (
      <div className="severity-switch btn-group">
        {SeveritySwitch.severities.map(({ name, title }) =>
          <button
            key={name}
            className={[
              `rule-severity-${name}`,
              selected === name ? "active" : "",
              "btn btn-link btn-xs",
            ].join(" ")}
            title={translate(title)}
            onClick={(e) => { e.preventDefault(); onSelect(name); }}
          >
            <i className={`icon-${name}`}></i>
          </button>
        )}
      </div>
    );
  }
}
