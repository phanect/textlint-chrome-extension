/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
"use strict";

import React from "react";
import MessageBox from "../common/message-box";
import IconButton from "../common/icon-button";

const RefreshMessage = React.createClass({
  propTypes: {
    onRefresh: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return { refreshing: false };
  },
  handleRefreshClick() {
    this.setState({ refreshing: true });
    this.props.onRefresh();
  },
  render() {
    const { refreshing } = this.state;
    return (
      <MessageBox text="requireRefresh" mark="refresh">
        <IconButton label="refresh" icon="refresh" btn="primary"
          disabled={refreshing} onClick={this.handleRefreshClick}
        />
      </MessageBox>
    );
  },
});

export default RefreshMessage;
