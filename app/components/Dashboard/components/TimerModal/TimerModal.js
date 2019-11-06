// @flow
import React from 'react';
import { Modal, Form, Tabs, Input, DatePicker } from 'antd';
import DayHourMinSecInput from '../DayHourMinSecInput/DayHourMinSecInput';
// import moment from 'moment';
// import styles from './TimerModal.scss';

// type Props = {};
const FormItem = Form.Item;
const { TabPane } = Tabs;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
};

// export default class TimerModal extends Component<Props> {
//   props: Props;
//
//   render () {
//     return (
//       <div className={styles.TimerModal} data-tid="container">
//
//       </div>
//     );
//   }
// }
const CollectionCreateForm = Form.create(/* {
  mapPropsToFields(props) {
    return {
      title: {
        ...props.title,
        value: props.title.value,
      },
    };
  }
} */)(
  props => {
    const {
      visible,
      activeKey,
      onCancel,
      onCreate,
      onTabClick,
      form,
      fields,
      onTextAreaChange
    } = props;
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
        <Tabs
          defaultActiveKey="1"
          activeKey={activeKey}
          onTabClick={onTabClick}
        >
          <TabPane tab="根据截止时间添加" key="1">
            <Form layout="horizontal">
              <FormItem label="任务名称" {...formItemLayout}>
                {getFieldDecorator('title', {
                  initialValue: fields.title,
                  rules: [{ required: true, message: '请输入任务名称！' }]
                })(<Input />)}
              </FormItem>
              <FormItem label="截止时间" {...formItemLayout}>
                {getFieldDecorator('date-time-picker', {
                  initialValue: fields.dateTimePicker,
                  rules: [
                    {
                      type: 'object',
                      required: activeKey === '1',
                      message: '请选择任务截止时间！'
                    }
                  ]
                })(
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                )}
              </FormItem>
              <FormItem label="">
                {getFieldDecorator('description')(
                  <TextArea
                    onChange={e => {
                      e.persist();
                      onTextAreaChange(e);
                    }}
                    placeholder="在此处按20190903095959格式输入时间，可自动提取"
                    autosize={{ minRows: 2, maxRows: 6 }}
                  />
                )}
              </FormItem>
            </Form>
          </TabPane>
          <TabPane tab="根据任务时长添加" key="2">
            <Form layout="horizontal">
              <FormItem label="任务名称" {...formItemLayout}>
                {getFieldDecorator('title', {
                  initialValue: fields.title,
                  rules: [{ required: true, message: '请输入任务名称！' }]
                })(<Input />)}
              </FormItem>
              <FormItem label="任务时长" {...formItemLayout}>
                {getFieldDecorator('value', {
                  initialValue: fields.duration,
                  rules: [
                    { required: activeKey === '2', validator: checkDuration }
                  ]
                })(<DayHourMinSecInput />)}
              </FormItem>
              <FormItem label="">
                {getFieldDecorator('description')(
                  <TextArea
                    onChange={e => {
                      e.persist();
                      onTextAreaChange(e);
                    }}
                    placeholder="在此处按00000000格式输入时间，可自动提取"
                    autosize={{ minRows: 2, maxRows: 6 }}
                  />
                )}
              </FormItem>
            </Form>
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
);

export default CollectionCreateForm;
