// @flow
import React, { Component } from 'react';
import { Icon, Progress } from 'antd';
import moment from 'moment';
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

  timeFilter = (timeStamp) => {
    let timeDiff;
    const d = Math.floor(timeStamp / (24 * 60 * 60 * 1000));
    timeDiff = timeStamp % (24 * 60 * 60 * 1000);
    const h = Math.floor(timeDiff / (60 * 60 * 1000));
    timeDiff %= (60 * 60 * 1000);
    const m = Math.floor(timeDiff / (60 * 1000));
    timeDiff %= (60 * 1000);
    const s = Math.floor(timeDiff / 1000);

    return {
      days: formatNumber(d),
      hours: formatNumber(h),
      minutes: formatNumber(m),
      seconds: formatNumber(s)
    };

    function formatNumber (value) {
      return value > 9 ? value : `0${value}`;
    }
  };

  render () {
    const { task: { id, title, createdTime, targetTime, remanentTime }, onDelete, onUpdate } = this.props;
    const targetTimeStr = moment(targetTime).format('YYYY-MM-DD HH:mm:ss');
    const percent = parseInt((1 - remanentTime / (targetTime - createdTime)) * 100, 10);
    const remanent = this.timeFilter(remanentTime);
    return (
      <div className={styles.TimerCard} data-tid="container">
        <div className={`clearfix ${styles.actions} ${percent > 80 ? styles.warn : ''}`}>
          <div className="fl" style={{ cursor: 'pointer' }}>
            <i className={`${styles.circle} ${percent > 80 ? styles.warn : ''}`}/>
            <span style={{ verticalAlign: 'middle' }}>结束任务</span>
          </div>
          <div className="fr">
            <Icon onClick={onUpdate} type="edit" style={{ marginRight: '20px', cursor: 'pointer' }}/>
            <Icon onClick={() => onDelete(id)} type="delete" style={{ cursor: 'pointer' }}/>
          </div>
        </div>
        <div className={styles['task-name']}>
          {title}
        </div>
        <div className={styles['task-deadline']}>
          截止时间：{targetTimeStr}
        </div>

        <div className={styles.progress}>
          <Progress type="circle" percent={percent} width={120} status="active" strokeWidth={8}/>
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
