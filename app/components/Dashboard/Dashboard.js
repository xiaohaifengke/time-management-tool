import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import routes from '../../constants/routes';
// import { Tabs, Button } from 'antd';
import { Button, Icon } from 'antd';
import styles from './Dashboard.scss';
import TimerCard from './components/TimerCard/TimerCard';

type Props = {};
export default class Dashboard extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <p>
            <span className={styles.title}>倒计时管理</span>
            <i className={styles.descr}>超好用的任务管理神器</i>
          </p>
        </header>

        <div className={styles.container}>
          <div className={styles['content-title']}>
            <span className={styles['tasks-title']}>任务列表</span>
            <span className={styles.category}>进行中</span>
            <span className={styles.category}>已完成</span>
            <div className={styles.actions}>
              <Button type="primary" ghost style={{ marginRight: '24px' }}>
                排序
                <Icon type="swap" />
              </Button>
              <Button type="primary" ghost>
                添加
                <Icon type="plus-square-o" />
              </Button>
            </div>
          </div>

          <TimerCard />
        </div>
      </div>
    );
  }
}
