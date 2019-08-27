// @flow
import React, { Component } from 'react';
import { Icon } from 'antd';
import styles from './TimerCard.scss';

type Props = {};

export default class TimerCard extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.TimerCard} data-tid="container">
        <div className={styles.actions}>
          <div className="fl">
            <i className={styles.circle} />
            <span>结束任务</span>
          </div>
          <div className="fr">
            <Icon type="edit" />
            <Icon type="delete" />
          </div>
        </div>
      </div>
    );
  }
}
