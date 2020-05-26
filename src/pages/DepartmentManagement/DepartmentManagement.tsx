import React, { useState, useEffect } from 'react'
import TreeList, { treeItem } from '@/components/TreeList/TreeList'
import { getServices } from '@/services/searchTable'
import {message, Form, Button} from 'antd'
import FormWrapper from '@/components/FormWrapper/FormWrapper'

interface DepartmentManagementProps {}
const DepartmentManagement: React.FC<DepartmentManagementProps> = props => {
  const [treeData, setTreeData] = useState<Array<treeItem>>([])
  const [form] = Form.useForm()
  const [selectNode, setSelectNode] = useState<object>({})
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    getTreeData()
  }, [])
  const getTreeData = () => {
    getServices({
      method: 'GET',
      url: '/services/department/getData'
    }).then(res => {
      if (res) {
        if (res.status === 'ok') {
          setTreeData(res.data || [])
        } else {
          message.error('获取数据失败')
        }
      } else {
        message.error('获取数据失败')
      }
    })
  }
  const onSelectTree = (keys:any, node:any) => {
    form.setFieldsValue({
      name: node.name,
      state: node.state,
    })
    setSelectNode(node)
  }
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: {span: 17}
  }
  const rules = [{
    required: true,
    // message: '必填项'
  }]
  const options = [
    {label: '启用', value: '1'},
    {label: '停用', value: '0'},
  ]
  const content = [
    {type: 'input', formItemProps: {name: 'name', label: '名称', rules,}, inputProps: {placeholder: '请输入部门名称'}},
    {type: 'select', formItemProps: {name: 'state', label: '状态', rules}, selectProps: {placeholder: '请选择', options,}},
  ]
  const submit = (values: any) => {
    setLoading(true)
    getServices({
      method: 'POST',
      url: '/services/department/update',
      data: {...selectNode, ...values}
    }).then(res => {
      if (res.status === 'ok') {
        setLoading(false)
        getTreeData()
      }
    })
  }
  return (
    <div style={{ height: '100%', background: '#fff', padding: 20 }}>
      <div style={{float: 'left', paddingRight: 20, borderRight: '1px solid #ccc', marginRight: 20}}>
        <TreeList
          treeData={treeData}
          onSelectTree={onSelectTree}
          width={350}
        />
      </div>
      <div style={{float: 'left'}}>
      <Form
        form={form}
        name='addUser'
        onFinish={submit}
        {...layout}
        // initialValues={userDetail}
      >
        <FormWrapper content={content} />
        <div style={{marginTop: 20, textAlign: 'center'}}>
          <Button type='primary' htmlType='submit' loading={loading}>保存</Button>
        </div>
      </Form>
      </div>
    </div>
  )
}
export default DepartmentManagement