import React, { Component, useState, useEffect,} from 'react'
import {Form, Space, Button, message} from 'antd'
import FormWrapper from '@/components/FormWrapper/FormWrapper'
import { getServices } from '@/services/searchTable'

interface AddUserProps {
  onCancel: () => void;
  initialValues?: object;
  type?: string;
  successCallback: () => void
}
interface submitVal {
  userName?: string;
  phone?: number | string;
  emial?: string;
  edu?: string;
  id?: number;
  dep?: any;
}
const AddUser: React.FC<AddUserProps> = props => {
  const [loading, setLoading] = useState(false)
  const [eduOptions, setEduOptions] = useState([])
  const [departmentData, setDepartmentData] = useState([])
  const [form] = Form.useForm()
  const { initialValues = {}, onCancel, successCallback, type } = props
  useEffect(() => {
    getServices({
      method: 'GET',
      url: '/services/lookup/edu'
    }).then(res => {
      if (res.status === 'ok') {
        setEduOptions(res.data)
      }
    })
    getServices({
      method: 'GET',
      url: '/services/department/getData'
    }).then(res => {
      if (res.status === 'ok') {
        setDepartmentData(res.data)
      }
    })
    form.setFieldsValue(initialValues)
  }, [])
  const submit = (values:submitVal) => {
    if (type === 'edit') {
      values.id = initialValues.id
    }
    let body = {
      method: 'POST',
      url: `/services/user/${type === 'edit' ? 'update' : 'add'}`,
      data: values
    }
    setLoading(true)
    getServices(body).then(res => {
      if (res) {
        if (res.status === 'ok') {
          message.success('保存成功')
          successCallback()
        } else {
          message.error(res.msg || '保存失败')
        }
      }
      setLoading(false)
    })
  }
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: {span: 17}
  }
  const rules = [{
    required: true,
    // message: '必填项'
  }]
  const content = [
    {type: 'input', formItemProps: {name: 'userName', label: '用户名', rules,}, inputProps: {placeholder: '请输入用户名'}},
    {type: 'inputNumber', formItemProps: {name: 'phone', label: '手机号', rules}, inputNumberProps: {placeholder: '请输入手机号', style: {width: '100%'}}},
    {type: 'input', formItemProps: {name: 'email', label: '邮箱',}, inputProps: {placeholder: '请输入邮箱'}},
    {type: 'select', formItemProps: {name: 'edu', label: '学历',}, selectProps: {placeholder: '请选择', options: eduOptions}},
    {type: 'cascader', formItemProps: {name: 'dep', label: '所属部门',rules}, cascaderProps: {placeholder: '请选择',fieldNames: {label: 'name', value: 'id', children: 'children'}, options: departmentData,changeOnSelect: true}},
  ]
  return (
    <Form
      form={form}
      name='addUser'
      onFinish={submit}
      {...layout}
      // initialValues={userDetail}
    >
      <FormWrapper content={content} />
      <div style={{marginTop: 20, textAlign: 'center'}}>
        <Space>
          <Button htmlType='button' onClick={onCancel}>取消</Button>
          <Button type='primary' htmlType='submit' loading={loading}>保存</Button>
        </Space>
      </div>
    </Form>
  )
}
export default AddUser