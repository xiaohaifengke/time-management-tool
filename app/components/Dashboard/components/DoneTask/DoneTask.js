// @flow
import React, { Component } from 'react';
import { Icon, Progress } from 'antd';
import styles from './DoneTask.scss';

type Props = {};

export default class DoneTask extends Component<Props> {
  props: Props;

  render () {
    const percent = 10;
    return (
      <div className={`${styles.DoneTask} clearfix`} data-tid="container">
        <div className={`${styles.wrapper} fl`}>
          <Icon type="bars"/>
        </div>
        <div className={`${styles.wrapper} fl`}>
          <div>任务1</div>
          <span>实际用时：01天00时00分00秒</span>
        </div>
        <div className={`${styles.wrapper} fl`}>
          <Progress type="circle" percent={percent} width={80} status="active" strokeWidth={6}/>
        </div>
        <div className={`${styles.wrapper} fl`}>
          <div>任务开始时间：</div>
          <div>任务截止时间：</div>
        </div>
        <div className={`${styles.wrapper} fl`}>
          <div>任务开始时间：</div>
          <div>任务截止时间：</div>
        </div>
        <div className={`${styles.wrapper} fl`}>
          已完成
        </div>
      </div>
    );
  }
}
