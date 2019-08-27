// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import styles from './Welcome.css';

type Props = {};

export default class Welcome extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>Welcome</h2>
        <Link to={routes.DASHBOARD}>to dashboard page</Link>
      </div>
    );
  }
}
