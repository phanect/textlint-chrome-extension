/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import React, { PropTypes } from "react";
import AboutSection from "./about-section";
import AuthorSection from "./author-section";
import LicenseSection from "./license-section";
import BundlesSection from "./bundles-section";

export default class AboutPage extends React.Component {
  static propTypes = {
    bundles: PropTypes.arrayOf(PropTypes.object).isRequired,
    onReady: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.onReady();
  }

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
}
