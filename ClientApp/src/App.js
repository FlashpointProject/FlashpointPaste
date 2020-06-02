import React, { Component } from 'react';
import { Route } from 'react-router';
import { Home } from './components/Home';
import { Layout } from './components/Layout';
import LogData from './components/LogData';
import './custom.css';
import './fancy.css';


export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/log' component={LogData} />
      </Layout>
    );
  }
}
