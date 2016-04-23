/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import React from "react";
import { translate } from "@io-monad/chrome-util";
import Paragraph from "./paragraph";

export default class LicenseSection extends React.Component {
  render() {
    return (
      <div className="license-section">
        <h2>{translate("license")}</h2>
        <Paragraph text="aboutS3P1" />
      </div>
    );
  }
}
