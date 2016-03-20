/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import {translate} from "../../../util/chrome-util";
import AboutSection from "./about-section";
import AuthorSection from "./author-section";
import LicenseSection from "./license-section";
import BundlesSection from "./bundles-section";

const AboutPage = React.createClass({
  propTypes: {
    bundles: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    onReady: React.PropTypes.func.isRequired,
  },
  componentDidMount() {
    this.props.onReady();
  },
  render() {
    return (
      <div className="about-page">
        <AboutSection />
        <AuthorSection />
        <LicenseSection />
        <BundlesSection bundles={this.props.bundles} />
      </div>
    );
  }
});

export default AboutPage;
