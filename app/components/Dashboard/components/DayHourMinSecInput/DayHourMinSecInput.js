// @flow
import React, { Component } from 'react';
import { Row, Col, Input } from 'antd';
// import styles from './DayHourMinSecInput.scss';

type Value = {
  days?: number,
  hours?: number,
  minutes?: number,
  seconds?: number
};

type Props = [{}, {
  value: Value
}];

export default class DayHourMinSecInput extends Component<Props> {
  props: Props;

  constructor (props) {
    super(props);
    const { value = {} } = props;
    this.state = {
      days: value.days || 0,
      hours: value.hours || 0,
      minutes: value.minutes || 0,
      seconds: value.seconds || 0
    };
  }

  componentWillReceiveProps (nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState(value);
    }
  }

  handleNumberChange = (type, e) => {
    let number = parseInt(e.target.value || 0, 10);
    if (Number.isNaN(number)) {
      number = 0;
    }
    switch (type) {
      case 'days':
        number = number > 999 ? 999 : number;
        break;
      case 'hours':
        number = number > 23 ? 23 : number;
        break;
      case 'minutes':
        number = number > 59 ? 59 : number;
        break;
      case 'seconds':
        number = number > 59 ? 59 : number;
        break;
      default:
        break;
    }

    if (!('value' in this.props)) {
      this.setState({ [type]: number });
    }
    this.triggerChange({ [type]: number });
  };

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  render () {
    const { days, hours, minutes, seconds } = this.state;
    return (
      <div>
        <Row gutter={12}>
          <Col span={6}>
            <Col span={16}>
              <Input
                type="text"
                value={days}
                onChange={this.handleNumberChange.bind(this, 'days')}
                style={{ padding: '4px 5px', textAlign: 'center' }}
              />
            </Col>
            <Col span={8}>
              天
            </Col>
          </Col>
          <Col span={6}>
            <Col span={16}>
              <Input
                type="text"
                value={hours}
                onChange={this.handleNumberChange.bind(this, 'hours')}
              />
            </Col>
            <Col span={8}>
              时
            </Col>
          </Col>
          <Col span={6}>
            <Col span={16}>
              <Input
                type="text"
                value={minutes}
                onChange={this.handleNumberChange.bind(this, 'minutes')}
              />
            </Col>
            <Col span={8}>
              分
            </Col>
          </Col>
          <Col span={6}>
            <Col span={16}>
              <Input
                type="text"
                value={seconds}
                onChange={this.handleNumberChange.bind(this, 'seconds')}
              />
            </Col>
            <Col span={8}>
              秒
            </Col>
          </Col>
        </Row>
      </div>
    );
  }
}
