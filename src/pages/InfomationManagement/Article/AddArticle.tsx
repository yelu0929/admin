import React, { useState, useEffect, ReactNode } from 'react'
import { Form, Space, Button, Col, Select, Modal } from 'antd'
import { getServices } from '@/services/searchTable'
import FormWrapper from '@/components/FormWrapper/FormWrapper'
import BraftEditor from '@/components/Editor/braftEditor'
import DropSelect from '@/components/DropSelect/DropSelect'
const Option = Select.Option
interface AddArticleProps {
  type: string;
  id: number | string;
  onCancel: () => void;
}
const AddArticle: React.FC<AddArticleProps> = props => {
  const [detail, setDetail] = useState<object>({})
  const [departmentData, setDepartmentData] = useState<Array<any>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [form] = Form.useForm()
  const { type, id, onCancel } = props
  useEffect(() => {
    id && getServices({
      method: 'GET',
      url: `/services/infomation/getArticleDetail/${id}`
    }).then(res => {
      if (res && res.status === 'ok') {
        setDetail(res.data)
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
  }, [])
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 }
  }
  const rules = [{
    required: true,
    // message: '必填项'
  }]
  const renderEditor = (): ReactNode => {
    return (
      <Col span={24}>
        <Form.Item {...layout} name='content' label='内容'>
          <BraftEditor disabled={type === 'detail'} initialValue={detail.content || ''} />
          {/* <Select></Select> */}
        </Form.Item>
      </Col>
    )
  }

  const serchData = (values: any, current: number, pageSize: number) => {
    let query = ''
    Object.keys(values).forEach(item => {
      if (values[item]) {
        if (query) {
          query += `${item}=${values[item]}`
        } else {
          query += `&${item}=${values[item]}`
        }
      }
    })
    return {
      method: 'GET',
      url: `/services/user/getUserList/${current}/${pageSize}?${query}`
    }
  }
  const columns = [
    {
      title: '用户名',
      key: 'userName',
      dataIndex: 'userName',
      align: 'center',
    },
    {
      title: '手机号',
      key: 'phone',
      dataIndex: 'phone',
      align: 'center',
    },
    {
      title: '邮箱',
      key: 'email',
      dataIndex: 'email',
      align: 'center',
    },
  ]
  const searchTableProps = {
    columns: columns,
    serchData: serchData,
    clearSelected: false,
    scroll: { y: 400 },
    type: 'radio',
  }
  const renderAuthor = (): ReactNode => {
    return (
      <Col span={24}>
        <Form.Item {...layout} name='authorId' label='作者'>
          <DropSelect title='选择作者' name='userName' searchTableProps={searchTableProps} />
        </Form.Item>
      </Col>
    )
  }
  const content = [
    { type: 'input', formItemProps: { name: 'title', label: '标题', rules, }, inputProps: { placeholder: '请输入标题', disabled: type === 'detail' } },
    { type: 'selfDefined', renderItem: renderAuthor },
    { type: 'cascader', formItemProps: { name: 'dep', label: '归属部门', ...layout }, cascaderProps: { placeholder: '请选择部门', disabled: type === 'detail', changeOnSelect: true, options: departmentData, fieldNames: { label: 'name', value: 'id', children: 'children' } } },
    { type: 'selfDefined', renderItem: renderEditor },
  ]
  const submit = (values: object) => {
    console.log('3333333333333333333333', values)
  }
  return (
    <Form
      form={form}
      name='AddArticle'
      onFinish={submit}
      {...layout}
    // initialValues={userDetail}
    >
      <FormWrapper content={content} />
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <Space>
          <Button htmlType='button' onClick={onCancel}>取消</Button>
          <Button type='primary' htmlType='submit' loading={loading}>保存</Button>
        </Space>
      </div>
    </Form>
  )
}
export default AddArticle