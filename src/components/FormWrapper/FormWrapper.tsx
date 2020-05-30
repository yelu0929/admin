import React, { Component, ReactNode,} from 'react'
import { Form, Row, Col, Input, InputNumber, Select, DatePicker, Cascader, Checkbox, Radio } from 'antd'
const { RangePicker } = DatePicker
interface FormWrapperProps {
  initival?: object;
  content: Array<any>;
}
const FormWrapper: React.FC<FormWrapperProps> = (props) => { 
  const { content = [] } = props
  return (
    <Row>
      {content.map((item, index) => {
        item.colProps = item.colProps || {span: 24}
        switch (item.type) {
          case 'selfDefined':
            if (item.renderItem) {
              return item.renderItem()
            } else {
              return null
            }
          case 'inputNumber':
            return (
              <Col {...item.colProps} key={index}>
                <Form.Item {...item.formItemProps}>
                  <InputNumber {...item.inputNumberProps} />
                </Form.Item>
              </Col>
            )
          case 'rangePicker':
            return (
              <Col {...item.colProps} key={index}>
                <Form.Item {...item.formItemProps}>
                  <RangePicker {...item.rangePickerProps} />
                </Form.Item>
              </Col>
            )
          case 'datePicker':
            return (
              <Col {...item.colProps} key={index}>
                <Form.Item {...item.formItemProps}>
                  <DatePicker {...item.datePickerProps} />
                </Form.Item>
              </Col>
            )
          case 'select':
            return (
              <Col {...item.colProps} key={index}>
                <Form.Item {...item.formItemProps}>
                  <Select {...item.selectProps} ></Select>
                </Form.Item>
              </Col>
            )
          case 'cascader':
            return (
              <Col {...item.colProps} key={index}>
                <Form.Item {...item.formItemProps}>
                  <Cascader {...item.cascaderProps} />
                </Form.Item>
              </Col>
            )
          case 'checkbox':
            return (
              <Col {...item.colProps} key={index}>
                <Form.Item {...item.formItemProps}>
                  <Checkbox.Group {...item.checkboxProps} />
                </Form.Item>
              </Col>
            )
          case 'radio':
            return (
              <Col {...item.colProps} key={index}>
                <Form.Item {...item.formItemProps}>
                  <Radio.Group {...item.radioProps} />
                </Form.Item>
              </Col>
            )
          default:
            return (
              <Col {...item.colProps} key={index}>
                <Form.Item {...item.formItemProps}>
                  <Input {...item.inputProps} />
                </Form.Item>
              </Col>
            )
        }
      })}
    </Row>
  )
}

export default FormWrapper