// @flow
import React, { Component } from 'react';
import { Button, Modal, Form, Input, Radio } from 'antd';
import styles from './TimerModal.scss';

type Props = {};

export default class TimerModal extends Component<Props> {
  props: Props;

  render () {
    return (
      <div className={styles.TimerModal} data-tid="container">

      </div>
    );
  }
}
