/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import React, { PropTypes } from "react";
import MessageBox from "../common/message-box";
import IconButton from "../common/icon-button";

export default class RefreshMessage extends React.Component {
  static propTypes = {
    onRefresh: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { refreshing: false };

    this.handleRefreshClick = this.handleRefreshClick.bind(this);
  }

  handleRefreshClick() {
    this.setState({ refreshing: true });
    this.props.onRefresh();
  }

  render() {
    const { refreshing } = this.state;
    return (
      <MessageBox text="requireRefresh" mark="refresh">
        <IconButton
          label="refresh" icon="refresh" btn="primary"
          disabled={refreshing} onClick={this.handleRefreshClick}
        />
      </MessageBox>
    );
  }
}
