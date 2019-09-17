import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import routes from '../../constants/routes';
// import { Tabs, Button } from 'antd';
import { Button, Icon, Modal, Tabs, Form, DatePicker, Input } from 'antd';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import * as DB from '../../database';
import styles from './Dashboard.scss';
import TimerCard from './components/TimerCard/TimerCard';
import DayHourMinSecInput from './components/DayHourMinSecInput/DayHourMinSecInput';

type Props = {};

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
};

const CollectionCreateForm = Form.create()(
  (props) => {
    const { visible, activeKey, onCancel, onCreate, onTabClick, form } = props;
    const { getFieldDecorator } = form;
    const checkDuration = (rule, value, callback) => {
      const { required } = rule;
      if (required) {
        if (value.days || value.hours || value.minutes || value.seconds) {
          callback();
          return;
        }
        callback('请输入时长'); // 任务时间必须大于0秒
      } else {
        callback();
      }
    };
    return (
      <Modal
        visible={visible}
        title="添加任务"
        okText="保存"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Tabs defaultActiveKey="1" activeKey={activeKey} onTabClick={onTabClick}>
          <TabPane tab="根据截止时间添加" key="1">
            <Form layout="horizontal">
              <FormItem label="任务名称" {...formItemLayout}>
                {getFieldDecorator('title', {
                  rules: [{ required: true, message: '请输入任务名称！' }]
                })(
                  <Input/>
                )}
              </FormItem>
              <FormItem label="截止时间" {...formItemLayout}>
                {getFieldDecorator('date-time-picker', {
                  rules: [{ type: 'object', required: activeKey === '1', message: '请选择任务截止时间！' }]
                })(
                  <DatePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm:ss"/>
                )}
              </FormItem>
              <FormItem label="">
                {getFieldDecorator('description')(
                  <TextArea placeholder="在此处按2019-09-03 09:59:59或20190903095959或190903095959格式输入时间，可自动提取"
                            autosize={{ minRows: 2, maxRows: 6 }}/>)}
              </FormItem>
            </Form>
          </TabPane>
          <TabPane tab="根据任务时长添加" key="2">
            <Form layout="horizontal">
              <FormItem label="任务名称" {...formItemLayout}>
                {getFieldDecorator('title', {
                  rules: [{ required: true, message: '请输入任务名称！' }]
                })(
                  <Input/>
                )}
              </FormItem>
              <FormItem label="任务时长" {...formItemLayout}>
                {getFieldDecorator('value', {
                  initialValue: { days: '', hours: '', minutes: '', seconds: '' },
                  rules: [{ required: activeKey === '2', validator: checkDuration }]
                })(<DayHourMinSecInput/>)}
              </FormItem>
              <FormItem label="">
                {getFieldDecorator('description')(
                  <TextArea placeholder="在此处按000000格式输入时间，可自动提取" autosize={{ minRows: 2, maxRows: 6 }}/>)}
              </FormItem>
            </Form>
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
);

export default class Dashboard extends Component<Props> {
  props: Props;

  state = {
    tabIndex: 1,
    visible: false,
    activeKey: '1',
    tasks: []
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

  showModal = () => {
    this.setState({ visible: true });
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
      targetTime,
      histories: [],
      mode: '1',
      remanentTime: targetTime - createdTime,
      done: false
    };
    const id = await DB.addTask(task);
    task.id = id;
    this.setState(prevState => ({
      tasks: [...prevState.tasks, task]
    }));
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
      targetTime,
      histories: [],
      mode: '2',
      remanentTime: targetTime - createdTime,
      done: false
    };
    const id = await DB.addTask(task);
    task.id = id;
    this.setState(prevState => ({
      tasks: [...prevState.tasks, task]
    }));
  };

  saveFormRef = (form) => {
    this.form = form;
  };

  tabClick = (index) => {
    this.setState({ tabIndex: index });
  };

  accompaniedKeyEvent = (e) => {
    console.log(e);
  };

  render () {
    const { tabIndex, visible, activeKey, tasks } = this.state;
    const timerCardList = tasks.map(task => <TimerCard task={task} key={task.id}/>);
    const doneCardList = <div>this is histroies page</div>;
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
            <div className={styles.actions}>
              <Button type="primary" ghost style={{ marginRight: '24px' }}>
                排序
                <Icon type="swap"/>
              </Button>
              <Button type="primary" ghost onClick={this.showModal}>
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
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          onTabClick={this.handleTabClick}
        />
      </div>
    );
  }
}
