import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
      <div>
        <h1>Welcome to Flashpoint Paste</h1>
        <p>To submit a paste, press the <b>'Upload Log'</b> on the Logs page of the Flashpoint Launcher</p>
        <p>A link will be copied to your clipboard for a publically accessible paste.</p>
      </div>
    );
  }
}
