import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import routes from '../../constants/routes';
// import { Tabs, Button } from 'antd';
import { Button, Icon, Modal, message } from 'antd';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import * as DB from '../../database';
import styles from './Dashboard.scss';
import TimerCard from './components/TimerCard/TimerCard';
import DoneCard from './components/DoneCard/DoneCard';
import CollectionCreateForm from './components/TimerModal/TimerModal';
import { timeFilter } from '../../utils';

type Props = {};

const { confirm } = Modal;

export default class Dashboard extends Component<Props> {
  props: Props;

  state = {
    tabIndex: 1,
    visible: false,
    editTaskId: 0, // 0: 新建, !0: 编辑任务的id
    activeKey: '1',
    tasks: [],
    doneTasks: [], // 已完成任务
    fields: {
      title: '',
      dateTimePicker: '',
      duration: { days: '', hours: '', minutes: '', seconds: '' }
    }
  };

  async componentWillMount () {
    const currentTimeStamp = new Date().getTime();
    let undoneTasks = await DB.queryTasksWhereLaterThanGivenTime(currentTimeStamp);
    undoneTasks = undoneTasks.map(task => ({
      ...task,
      remanentTime: task.targetTime - currentTimeStamp,
      done: false
    }));
    this.setState({
      tasks: undoneTasks
    });
  }

  componentDidMount () {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  tick () {
    const { tasks } = this.state;
    const currentTimeStamp = new Date().getTime();
    /* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["task"] }] */
    tasks.forEach(task => {
      if (!task.done) {
        let remanentTime = task.targetTime - currentTimeStamp;
        let done = false;
        if (remanentTime <= 0) {
          remanentTime = 0;
          done = true;
          const needUpdatedTask = { ...task, doneTime: currentTimeStamp, done: 1 };
          DB.updateTask(needUpdatedTask);
        }
        task.remanentTime = remanentTime;
        task.done = done;
      }
    });
    // const updatedTasks = tasks.filter(task => !task.done);
    this.setState({
      tasks
    });
  }

  sortTask = () => {
    this.setState(prevState => {
      prevState.tasks.sort((a, b) => (a.remanentTime - b.remanentTime));
      return { tasks: prevState.tasks };
    });
  };

  showModal = (task) => {
    const fields = task ? {
      title: task.title,
      dateTimePicker: moment(task.targetTime),
      duration: timeFilter(task.remanentTime)
    } : {
      title: '',
      dateTimePicker: moment(),
      duration: { days: '', hours: '', minutes: '', seconds: '' }
    };
    this.setState({
      editTaskId: task && task.id || 0,
      visible: true,
      activeKey: task && task.mode || '1',
      fields
    });
  };

  handleTabClick = (key) => {
    this.setState({ activeKey: key });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const { form } = this;
    const { activeKey } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      if (activeKey === '1') {
        this.addTaskByTargetTime(values);
      } else if (activeKey === '2') {
        this.addTaskByDuration(values);
      }
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  addTaskByTargetTime = async (values) => {
    const { title, 'date-time-picker': dateTimePicker } = values;
    const targetTime = dateTimePicker.valueOf();
    const createdTime = moment().valueOf();
    const task = {
      title,
      createdTime,
      updatedTime: createdTime,
      targetTime,
      histories: [],
      mode: '1',
      remanentTime: targetTime - createdTime,
      done: false
    };
    this.persistenceLogic(task);
  };

  addTaskByDuration = async (values) => {
    const { title, value: { days, hours, minutes, seconds } } = values;
    const timeStamps =
      days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000
      + minutes * 60 * 1000 + seconds * 1000;
    const targetTime = moment().add(timeStamps, 'ms').valueOf();
    const createdTime = moment().valueOf();
    const task = {
      title,
      createdTime,
      updatedTime: createdTime,
      targetTime,
      histories: [],
      mode: '2',
      remanentTime: targetTime - createdTime,
      done: false
    };
    this.persistenceLogic(task);
  };

  persistenceLogic = async (task) => {
    const { editTaskId, tasks } = this.state;
    if (editTaskId) { // update
      const index = tasks.findIndex(item => item.id === editTaskId);
      const oldTask = tasks[index];
      const { title, createdTime, updatedTime, targetTime, histories, done, mode } = oldTask;
      histories.push({ title, createdTime, updatedTime, targetTime, done, mode, recordTime: moment().valueOf() });
      task.id = editTaskId;
      task.histories = histories;
      task.createdTime = createdTime;
      try {
        await DB.updateTask(task);
        message.success('任务保存成功');
        tasks.splice(index, 1, task);
        this.setState({ tasks });
      } catch (e) {
        console.error (e);
        message.error('任务保存异常');
      }
    } else { // create
      try {
        const id = await DB.addTask(task);
        task.id = id;
        this.setState(prevState => ({
          tasks: [...prevState.tasks, task]
        }));
      } catch (e) {
        console.error (e);
        message.error('任务保存异常');
      }
    }
  };

  saveFormRef = (form) => {
    this.form = form;
  };

  tabClick = async (index) => {
    let undoneTasks = [];
    let doneTasks = [];
    if (index === 1) {
      const currentTimeStamp = new Date().getTime();
      undoneTasks = await DB.queryTasksWhereLaterThanGivenTime(currentTimeStamp);
      undoneTasks = undoneTasks.map(task => ({
        ...task,
        remanentTime: task.targetTime - currentTimeStamp,
        done: false
      }));
      this.setState({ tabIndex: index, tasks: undoneTasks });
    } else if (index === 2) {
      try {
        doneTasks = await DB.queryDoneTask();
      } catch (e) {
        message.error('查询异常，请重启应用后重试。');
      }
      this.setState({ tabIndex: index, doneTasks });
    }
  };

  accompaniedKeyEvent = (e) => {
    console.log(e);
  };

  showDeleteConfirm = (id) => {
    const { tasks } = this.state;
    const self = this;
    confirm({
      title: '确认删除',
      content: '删除后将不可恢复，是否确认删除？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      async onOk () {
        await DB.deleteTask(id).catch(err => {
          console.log(err);
          message.error('任务删除异常');
        });
        message.success('任务删除成功');
        const newTasks = tasks.filter(item => item.id !== id);
        self.setState({ tasks: newTasks });
      },
      onCancel () {
        message.info('已取消删除该任务');
      }
    });
  };

  showTerminateConfirm = (task) => {
    const { tasks } = this.state;
    const self = this;
    confirm({
      title: '确认结束',
      content: '确定提前结束任务？',
      okText: '确定',
      okType: 'warn',
      cancelText: '取消',
      async onOk () {
        const currentTime = moment().valueOf();
        const { title, createdTime, updatedTime, targetTime, histories, done, mode } = task;
        histories.push({ title, createdTime, updatedTime, targetTime, done, mode, recordTime: currentTime });
        const updatedTask = { ...task, updatedTime: currentTime, doneTime: currentTime };
        await DB.updateTask(updatedTask).catch(err => {
          console.log(err);
          message.error('任务结束异常');
        });
        message.success('任务结束成功');
        const index = tasks.findIndex(item => item.id === updatedTask.id);
        tasks.splice(index, 1, updatedTask);
        self.setState({ tasks });
      },
      onCancel () {
        message.info('已取消结束该任务');
      }
    });
  };

  restart = (id) => {
    const { doneTasks } = this.state;
    const self = this;
    confirm({
      title: '重新开始',
      content: '确认重新开始该任务？',
      okText: '确定',
      okType: 'warn',
      cancelText: '取消',
      async onOk () {
        const doneTask = doneTasks.find(item => item.id === id);
        const {title, mode, createdTime, targetTime} = doneTask;
        const newCreatedTime = moment().valueOf();
        const newTargetTime = newCreatedTime + targetTime - createdTime;
        const task = {
          title: `${title}-${newCreatedTime}`,
          createdTime: newCreatedTime,
          updatedTime: newCreatedTime,
          targetTime: newTargetTime,
          histories: [],
          mode,
          remanentTime: newTargetTime - newCreatedTime,
          done: false
        };
        self.persistenceLogic(task);
      },
      onCancel () {
        message.info('已取消重新开始该任务');
      }
    });
  }

  render () {
    const { tabIndex, visible, activeKey, tasks, doneTasks, fields } = this.state;
    const timerCardList = tasks.map(task =>
      <TimerCard
        task={task}
        key={task.id}
        onTerminate={this.showTerminateConfirm}
        onUpdate={this.showModal}
        onDelete={this.showDeleteConfirm}/>);
    const doneCardList = doneTasks.map(doneTask =>
      <DoneCard
        onRestart={this.restart}
        task={doneTask}
        key={doneTask.id}/>);
    const resultList = tabIndex === 1 ? timerCardList : doneCardList;
    return (
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <p style={{ height: '100%' }}>
            {/* <span className={`${styles.title} `}>timer</span> */}
            <svg width="220" height="50">
              <text textAnchor="middle" x="50%" y="86%" className={`${styles.title}`}>
                timer
              </text>
              <text textAnchor="middle" x="50%" y="86%" className={`${styles.title} ${styles.title1}`}>
                timer
              </text>
              <text textAnchor="middle" x="50%" y="86%" className={`${styles.title} ${styles.title2}`}>
                timer
              </text>
              <text textAnchor="middle" x="50%" y="86%" className={`${styles.title} ${styles.title3}`}>
                timer
              </text>
              <text textAnchor="middle" x="50%" y="86%" className={`${styles.title} ${styles.title4}`}>
                timer
              </text>
            </svg>
            <i className={styles.descr}>欢迎使用倒计时管理工具 timer</i>
          </p>
        </header>

        <div className={styles.container}>
          <div className={styles['content-title']}>
            <span className={styles['tasks-title']}>任务列表</span>
            <span
              onClick={this.tabClick.bind(this, 1)}
              onKeyDown={this.accompaniedKeyEvent}
              className={`${styles.category} ${tabIndex === 1 ? styles.active : ''}`}
              role="button"
              tabIndex={-1}>进行中</span>
            <span
              onClick={this.tabClick.bind(this, 2)}
              onKeyDown={this.accompaniedKeyEvent}
              className={`${styles.category} ${tabIndex === 2 ? styles.active : ''}`}
              role="button"
              tabIndex={-1}>已完成</span>
            <div className={`${styles.actions} ${tabIndex === 2 ? 'hidden' : ''}`}>
              <Button type="primary" ghost onClick={this.sortTask} style={{ marginRight: '24px' }}>
                排序
                <Icon type="swap"/>
              </Button>
              <Button type="primary" ghost onClick={() => this.showModal()}>
                添加
                <Icon type="plus-square-o"/>
              </Button>
            </div>
          </div>
          <div className={styles['task-card']}>
            <Scrollbars style={{ width: '100%', height: '100%' }}>
              {resultList}
            </Scrollbars>
          </div>
        </div>
        <CollectionCreateForm
          ref={this.saveFormRef}
          activeKey={activeKey}
          fields={fields}
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          onTabClick={this.handleTabClick}
        />
      </div>
    );
  }
}

