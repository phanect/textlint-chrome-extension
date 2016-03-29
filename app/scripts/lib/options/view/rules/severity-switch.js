/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import { translate } from "../../../util/chrome-util";

const Severities = [
  { name: "error", title: "showAsErrors" },
  { name: "warning", title: "showAsWarnings" },
  { name: "info", title: "showAsInfo" },
];

const SeveritySwitch = React.createClass({
  propTypes: {
    selected: React.PropTypes.string.isRequired,
    onSelect: React.PropTypes.func.isRequired,
  },
  render() {
    const { selected, onSelect } = this.props;
    return (
      <div className="severity-switch btn-group">
        {Severities.map(({ name, title }) =>
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
  },
});

export default SeveritySwitch;
