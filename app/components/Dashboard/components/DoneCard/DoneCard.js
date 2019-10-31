// @flow
import React, { Component } from 'react';
import { Icon, Progress, Button } from 'antd';
import moment from 'moment';
import { timeFilter } from '../../../../utils';
import styles from './DoneCard.scss';

type Props = {
  task: {
    title: string,
    mode: string,
    createdTime: number,
    targetTime: number,
    doneTime: number
  }
};

export default class DoneCard extends Component<Props> {
  props: Props;

  timeFilter = timeFilter;

  render () {
    const { task, onRestart } = this.props;
    const { id, title, mode, createdTime, targetTime } = task;
    let { doneTime } = task;
    doneTime = doneTime > 0 ? doneTime : targetTime;
    const createdTimeStr = moment(createdTime).format('YYYY-MM-DD HH:mm:ss');
    const targetTimeStr = moment(targetTime).format('YYYY-MM-DD HH:mm:ss');
    const percent = parseInt(((doneTime - createdTime) / (targetTime - createdTime)) * 100, 10);
    const duration = this.timeFilter(doneTime - createdTime);
    // if (title === '666') {
    //   debugger;
    //   console.log(duration);
    // }
    return (
      <div className={styles.DoneCard} data-tid="container">
        <div className={styles.wrapper}>
          <div className={styles['icon-container']}><Icon type="exception" className={styles.icon}/></div>
          <div className={styles['title-duration']}>
            <div title={title} className={`${styles.title} text-ellipsis`}>{title}</div>
            <div className={styles.duration}>
              <span>实际用时：</span>
              <span>{duration.days}</span>天
              <span>{duration.hours}</span>时
              <span>{duration.minutes}</span>分
              <span>{duration.seconds}</span>秒
            </div>
          </div>
          <div className={styles['progress-container']}>
            <Progress type="circle" percent={percent} width={75} status="active" strokeWidth={8}/>
          </div>
          <div className={styles['task-time-info']}>
            <div className={styles['begin-time']}>任务开始时间：<span className={styles.time}>{createdTimeStr}</span></div>
            <div className={styles['end-time']}>任务截止时间：<span className={styles.time}>{targetTimeStr}</span></div>
          </div>
          <div className={styles['task-done-time']}>
            <div className={styles['task-deadline-date']}>{moment(doneTime).format('YYYY-MM-DD')}</div>
            <div className={styles['task-deadline-time']}>{moment(doneTime).format('HH:mm:ss')}</div>
          </div>
          <div className={styles['task-status']}>
            {doneTime < targetTime ? '提前结束' : '已结束'}
            <div className={styles.shade}/>
            <Button onClick={() => onRestart(id)} type="primary" className={styles.restart}>重新开始</Button>
          </div>
        </div>
      </div>
    );
  }
}
