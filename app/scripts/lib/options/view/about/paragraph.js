/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import React, { PropTypes } from "react";
import { translate } from "../../../util/chrome-util";

export default class Pargraph extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
  };

  render() {
    return (
      <p dangerouslySetInnerHTML={{ __html: translate(this.props.text) }}></p>
    );
  }
}
