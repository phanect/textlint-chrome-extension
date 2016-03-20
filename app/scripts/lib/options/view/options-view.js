/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import PageSwitch from "./pages/page-switch";
import PagePanel from "./pages/page-panel";
import RulesPage from "./rules/rules-page";
import VisualPage from "./visual/visual-page";
import AboutPage from "./about/about-page";
import FooterPanel from "./footer/footer-panel";

const OptionsView = React.createClass({
  pages: [
    { name: "rules", menuTitle: "menuRules", pageTitle: "customizeRules", icon: "pencil" },
    { name: "visual", menuTitle: "menuVisual", pageTitle: "visualEffects", icon: "eye" },
    { name: "about", menuTitle: "menuAbout", pageTitle: "aboutExtension", icon: "info-circle" },
  ],
  propTypes: {
    controller: React.PropTypes.object.isRequired,
    bundles: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    rules: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    appOptions: React.PropTypes.object.isRequired,
    appVersion: React.PropTypes.string.isRequired,
    appStoreURL: React.PropTypes.string.isRequired,
  },
  componentWillMount() {
    this.readyPageCount = 0;
    this.editors = {};
  },
  getInitialState() {
    return {
      saveEnabled: false,
      activePage: null,
    };
  },

  handlePageReady(pageName, editor) {
    if (editor) {
      this.editors[pageName] = editor;
    }
    if (++this.readyPageCount === this.pages.length) {
      this.setState({ saveEnabled: true, activePage: "rules" });
    }
  },
  handlePageChange(page) {
    if (!this.state.activePage) return;
    this.setState({ activePage: page });
  },
  handleSaveClick() {
    if (this.validate()) {
      this.props.controller.save(
        this.editors.rules.serialize(),
        this.editors.visual.serialize()
      );
    }
  },
  validate() {
    return _.every(this.editors, (editor, pageName) => {
      const errors = editor.validate();
      if (errors.length > 0) {
        this.setLocation(pageName, errors.location);
        return false;
      }
      return true;
    });
  },
  setLocation(pageName, hash) {
    this.setState({ activePage: pageName }, () => {
      if (hash) location.href = hash;
    });
  },

  render() {
    const {controller, bundles, rules, appOptions, appVersion, appStoreURL} = this.props;
    const {saveEnabled, activePage} = this.state;

    const pageContents = {
      rules:  <RulesPage rules={rules}
        onReady={(editor) => this.handlePageReady("rules", editor)} />,
      visual: <VisualPage appOptions={appOptions}
        onReady={(editor) => this.handlePageReady("visual", editor)} />,
      about:  <AboutPage bundles={bundles}
        onReady={() => this.handlePageReady("about")} />,
    };

    return (
      <div className="options-view">
        <div className="top-pane">
          <div className="menu-pane">
            <PageSwitch activePage={activePage} onPageChange={this.handlePageChange} pages={this.pages} />
          </div>
          <div className="main-pane">
            <div className="tab-content">
              {this.pages.map(page =>
                <PagePanel
                  key={page.name}
                  active={activePage === page.name}
                  title={page.pageTitle}
                  icon={page.icon}
                >
                  {pageContents[page.name]}
                </PagePanel>
              )}
            </div>
          </div>
        </div>
        <div className="bottom-pane">
          <FooterPanel
            appVersion={appVersion}
            appStoreURL={appStoreURL}
            saveEnabled={saveEnabled}
            onSaveClick={this.handleSaveClick}
          />
        </div>
      </div>
    );
  },
});

export default OptionsView;
