import React, { Component, ReactNode } from 'React'
import SearchTable, { serchData } from '@/components/SearchTable/SearchTable'
import { Button, Divider, Popconfirm, Space, Row, Col, Input, Form, Modal, message } from 'antd'
import { getServices } from '@/services/searchTable'
import AddUser from '@/pages/UserManagement/AddUser'
import FormWrapper from '@/components/FormWrapper/FormWrapper'

interface IUserManagementProps {

}
interface IUserManagementState {
  selectRowKeys: Array<any>;
  visible: boolean;
  type: string;
  userDetail: object;
}
export default class UserManagement extends Component<IUserManagementProps, IUserManagementState> {
  constructor(props: IUserManagementProps) {
    super(props)
    this.state = {
      selectRowKeys: [],
      visible: false,
      type: 'add',
      userDetail: {},
    }
  }
  public searchTable: any
  public columns: Array<any> = [
    {
      title: '序号',
      key: 'xuhao',
      dataIndex: 'xuhao',
      align: 'center',
      render: (text: any, record: any, index: any) => {
        return index + 1
      }
    },
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
    {
      title: '学历',
      key: 'eduDesp',
      dataIndex: 'eduDesp',
      align: 'center',
    },
    {
      title: '创建时间',
      key: 'creatDate',
      dataIndex: 'creatDate',
      align: 'center',
    },
    {
      title: '操作',
      key: 'opotor',
      dataIndex: 'opotor',
      align: 'center',
      render: (text: any, record: any) => {
        return (
          <span>
            <Button type="link" onClick={() => this.updateUser('edit', record)}>编辑</Button>
            <Divider type="vertical" />
            {/* <Button type="link" danger onClick={() => this.deleteUser([record.id])}>删除</Button> */}
            <Popconfirm
              title="数据删除后无法恢复，确认删除吗？"
              onConfirm={() => this.deleteUser([record.id])}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger >删除</Button>
            </Popconfirm>
          </span>
        )
      }
    }
  ]
  deleteUser = (ids: Array<any>) => {
    let body = {
      url: '/services/user/delete',
      method: 'POST',
      data: ids
    }
    getServices(body).then(res => {
      if (res) {
        if (res.status === 'ok') {
          message.success('删除成功')
          this.searchTable.refresh()
        }
      } else {
        message.success('删除失败')
      }
    })
  }
  serchData = (values: any, current: number, pageSize: number) => {
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
  updateUser = (type: string, record = {}) => {
    this.setState({ type, visible: true })
    if (type === 'add') {
      this.setState({ userDetail: {} })
    } else if (type === 'edit') {
      // setTimeout(() => {
      //   this.setState({ userDetail: record })
      // }, 10)
      this.setState({ userDetail: record })
    }
  }
  btnList = () => {
    const { selectRowKeys } = this.state
    return (
      <Space>
        <Button type='primary' onClick={() => this.updateUser('add')}>新建</Button>
        <Popconfirm
          title="数据删除后无法恢复，确认删除吗？"
          onConfirm={() => this.deleteUser(selectRowKeys)}
          okText="确定"
          cancelText="取消"
        >
          <Button danger disabled={selectRowKeys.length ? false : true} >批量删除</Button>
        </Popconfirm>
      </Space>
    )
  }
  onSelectChange = (selectRowKeys: Array<any>, selectRows: Array<any>) => {
    this.setState({ selectRowKeys })
  }
  successCallback = () => {
    if (this.state.type === 'edit') {
      this.searchTable.getTableData()
    } else {
      this.searchTable.refresh()
    }
    this.setState({visible: false})
  }
  render(): ReactNode {
    const {type, visible, userDetail} = this.state
    return (
      <div>
        <SearchTable
          serchData={this.serchData}
          columns={this.columns}
          getInstance={e => this.searchTable = e}
          btnList={this.btnList()}
          onSelectChange={this.onSelectChange}
          formItems={SearchForm}
        />
        <Modal
          title={type === 'edit' ? '编辑用户' : '新建用户'}
          visible={visible}
          // onOk={this.handleOk}
          onCancel={() => this.setState({visible: false})}
          destroyOnClose
          width={800}
          footer={null}
        >
          <AddUser successCallback={this.successCallback} onCancel={() => this.setState({visible: false})} type={type} initialValues={userDetail} />
        </Modal>
      </div>
    )
  }
}
class SearchForm extends Component {
  render(): ReactNode {
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 19 },
    };
    const colProps = {span: 8}
    const content = [
      {type: 'input', colProps, formItemProps: {name: 'userName', label: '用户名', ...layout}, inputProps: {placeholder: '请输入用户名'}},
      {type: 'inputNumber', colProps, formItemProps: {name: 'phone', label: '手机号', ...layout}, inputNumberProps: {placeholder: '请输入手机号', style: {width: '100%'}}},
      {type: 'input', colProps, formItemProps: {name: 'email', label: '邮箱', ...layout}, inputProps: {placeholder: '请输入邮箱'}},
    ]
    return (
      <FormWrapper content={content} />
    )
  }
}