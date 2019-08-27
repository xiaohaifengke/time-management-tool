// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>This is HomePage</h2>
        <Link to={routes.COUNTER}>to COUNTER</Link>
        <br />
        <Link to={routes.WELCOME}>to WELCOME</Link>
        <br />
        <Link to={routes.DASHBOARD}>to DASHBOARD</Link>
      </div>
    );
  }
}
