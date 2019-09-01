// @flow
import React, { Component } from 'react';
import { Icon, Progress } from 'antd';
import styles from './TimerCard.scss';

type Props = {};

export default class TimerCard extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.TimerCard} data-tid="container">
        <div className={`clearfix ${styles.actions}`}>
          <div className="fl">
            <i className={styles.circle} />
            <span style={{verticalAlign: 'middle'}}>结束任务</span>
          </div>
          <div className="fr">
            <Icon type="edit" style={{marginRight: '20px'}}/>
            <Icon type="delete"/>
          </div>
        </div>
        <div className={styles['task-name']}>
          第一个工作任务计划
        </div>
        <div className={styles['task-deadline']}>
          截止时间：2019-07-20 08:15:00
        </div>

        <div className={styles.progress}>
          <Progress type="circle" percent={70} width={120} status="active" strokeWidth={8} />
        </div>
        <div className={styles.remanent}>
          <span className={styles['time-digit']}>00</span>天
          <span className={styles['time-digit']}>00</span>时
          <span className={styles['time-digit']}>00</span>分
          <span className={styles['time-digit']}>00</span>秒
        </div>
      </div>
    );
  }
}
