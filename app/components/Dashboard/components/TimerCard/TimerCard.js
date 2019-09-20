// @flow
import React, { Component } from 'react';
import { Icon, Progress } from 'antd';
import moment from 'moment';
import { timeFilter } from '../../../../utils';
import styles from './TimerCard.scss';

type Props = {
  onDelete: Function,
  onUpdate: Function,
  task: {
    title: string,
    createdTime: number,
    targetTime: number,
    histories: []
  }
};

export default class TimerCard extends Component<Props> {
  props: Props;

  timeFilter = timeFilter;

  render () {
    /* eslint-disable no-nested-ternary */
    const { task, onDelete, onUpdate, onTerminate } = this.props;
    const { id, title, createdTime, targetTime, remanentTime, mode } = task;
    const targetTimeStr = moment(targetTime).format('YYYY-MM-DD HH:mm:ss');
    const percent = parseInt((1 - remanentTime / (targetTime - createdTime)) * 100, 10);
    const remanent = this.timeFilter(remanentTime);
    const duration = this.timeFilter(targetTime - createdTime);
    return (
      <div className={styles.TimerCard} data-tid="container">
        <div className={`clearfix ${styles.actions} ${percent > 80 ? styles.warn : ''}`}>
          <div onClick={() => onTerminate(task)} className="fl" style={{ cursor: 'pointer' }}>
            <i className={`${styles.circle} ${percent > 80 ? styles.warn : ''}`}/>
            <span style={{ verticalAlign: 'middle' }}>结束任务</span>
          </div>
          <div className="fr">
            <Icon onClick={() => onUpdate(task)} type="edit" style={{ marginRight: '20px', cursor: 'pointer' }}/>
            <Icon onClick={() => onDelete(id)} type="delete" style={{ cursor: 'pointer' }}/>
          </div>
        </div>
        <div className={styles['task-name']}>
          {title}
        </div>
        <div className={styles['task-deadline']}>
          <span className={mode === '1' ? (percent > 80 ? styles.warn : styles.normal) : ''}>截止时间</span>：{targetTimeStr}
        </div>
        <div className={styles['task-deadline']}>
          <span className={mode === '2' ? (percent > 80 ? styles.warn : styles.normal) : ''}>任务时长</span>：
          <span>{duration.days}</span>天
          <span>{duration.hours}</span>时
          <span>{duration.minutes}</span>分
          <span>{duration.seconds}</span>秒
        </div>

        <div className={styles.progress}>
          <Progress type="circle" percent={percent} width={102} status="active" strokeWidth={8}/>
        </div>
        <div className={styles.remanent}>
          <span className={`${styles['time-digit']}  ${percent > 80 ? styles.warn : ''}`}>{remanent.days}</span>天
          <span className={`${styles['time-digit']}  ${percent > 80 ? styles.warn : ''}`}>{remanent.hours}</span>时
          <span className={`${styles['time-digit']}  ${percent > 80 ? styles.warn : ''}`}>{remanent.minutes}</span>分
          <span className={`${styles['time-digit']}  ${percent > 80 ? styles.warn : ''}`}>{remanent.seconds}</span>秒
        </div>
      </div>
    );
  }
}
