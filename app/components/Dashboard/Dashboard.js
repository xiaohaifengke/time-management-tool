import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import routes from '../../constants/routes';
// import { Tabs, Button } from 'antd';
import { Button, Icon, Modal, Tabs, Form, DatePicker, Input } from 'antd';
import styles from './Dashboard.scss';
import TimerCard from './components/TimerCard/TimerCard';

type Props = {};

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

const CollectionCreateForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="添加任务"
        okText="保存"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="根据截止时间添加" key="1">
            <Form layout="horizontal">
              <FormItem label="Title" {...formItemLayout}>
                {getFieldDecorator('title', {
                  rules: [{ required: true, message: 'Please input the title of collection!' }]
                })(
                  <Input/>
                )}
              </FormItem>
              <FormItem label="Description" {...formItemLayout}>
                {getFieldDecorator('description')(<Input type="textarea"/>)}
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
              <FormItem label="截止时间" {...formItemLayout}>
                {getFieldDecorator('date-time-picker', {
                  rules: [{ type: 'object', required: true, message: '请选择任务截止时间！' }],
                })(
                  <DatePicker style={{width: '100%'}} showTime format="YYYY-MM-DD HH:mm:ss"/>
                )}
              </FormItem>
              <FormItem label="Description" {...formItemLayout}>
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
    visible: false
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const { form } = this;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = (form) => {
    this.form = form;
  }

  render () {
    const { visible } = this.state;
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
            <span className={styles.category}>进行中</span>
            <span className={styles.category}>已完成</span>
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

          <TimerCard/>
        </div>
        <CollectionCreateForm
          ref={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}
