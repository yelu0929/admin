import React, { useState, useEffect, useRef } from 'react'
import { Tabs, Button, Divider, Popconfirm, Space, message, Modal, } from 'antd'
import SearchTable from '@/components/SearchTable/SearchTable'
import { getServices } from '@/services/searchTable'
import FormWrapper from '@/components/FormWrapper/FormWrapper'
import { history } from 'umi';
import moment from 'moment'
import AddArticle from './AddArticle'
const { TabPane } = Tabs

interface ArticleProps { }
const SearchForm: React.FC = props => {
  const [depData, setDepData] = useState<Array<any>>([])
  useEffect(() => {
    getServices({
      method: 'GET',
      url: '/services/department/getData'
    }).then(res => {
      if (res && res.status === 'ok') {
        setDepData(res.data || [])
      }
    })
  }, [])
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
  };
  const colProps = {span: 8}
  const content = [
    {type: 'input', colProps, formItemProps: {name: 'title', label: '标题', ...layout}, inputProps: {placeholder: '请输入文章标题'}},
    {type: 'cascader', colProps, formItemProps: {name: 'dep', label: '归属部门', ...layout}, cascaderProps: {placeholder: '请选择部门',changeOnSelect: true, options:depData,  fieldNames: {label: 'name', value: 'id', children: 'children'}}},
    {type: 'rangePicker', colProps, formItemProps: {name: 'creatDate', label: '创建时间', ...layout}, rangePickerProps: {}},
  ]
  return (
    <FormWrapper content={content} />
  )
}
const Article: React.FC<ArticleProps> = props => {
  const [activeKey, setActiveKey] = useState<string>('1')
  const [selectRowKeys, setselectRowKeys] = useState<Array<any>>([])
  const [searchTableThis, SetSearchTableThis] = useState<any>(null)
  const [type, setType] = useState<string>('add')
  const [visible, setVisible] = useState<boolean>(false)
  const [id, setId] = useState<string | number>('')
  // let searchTableThis: any = null
  const columns = [
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
      title: '标题',
      key: 'title',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '所属部门',
      key: 'departmentName',
      dataIndex: 'departmentName',
      align: 'center',
    },
    {
      title: '作者',
      key: 'authorName',
      dataIndex: 'authorName',
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
            <Button type="link" onClick={() => updateArticle('edit', record.id)}>编辑</Button>
            <Divider type="vertical" />
            <Button type="link" onClick={() => updateArticle('detail', record.id)}>编辑</Button>
            <Divider type="vertical" />
            {
              record.state === '1' ? <Button type="link" onClick={() => publishArticle([record.id], '2')}>发布</Button>
                : record.state === '2' ? <Button type="link" onClick={() => publishArticle([record.id], '3')}>下线</Button> : record.state === '3' ? <Button type="link" onClick={() => publishArticle([record.id], '2')}>上线</Button> : null
            }
            <Divider type="vertical" />
            <Popconfirm
              title="数据删除后无法恢复，确认删除吗？"
              onConfirm={() => deleteArticle([record.id])}
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
  const updateArticle = (type: string, id = '') => {
    setType(type)
    setVisible(true)
    setId(id)
  }
  const publishArticle = (idList: Array<any>, state: string) => {

  }
  const deleteArticle = (idList: Array<any>) => {
    getServices({
      method: 'POST',
      url: '/services/infomation/article/delete',
      data: idList || []
    }).then(res => {
      if (res && res.status === 'ok') {
        message.success('删除成功')
        searchTableThis.refresh()
      }
    })
  }
  const serchData = (values: any, current: number, pageSize: number) => {
    let query = `state=${activeKey}`
    if (values.title) {
      query += `&title=${values.title}`
    }
    if (values.dep) {
      query += `&dep=${values.dep.toString()}`
    }
    if (values.creatDate) {
      query += `&startDate=${moment(values.creatDate[0]).format('YYYY-MM-DD 00:00:00')}&endDate=${moment(values.creatDate[1]).format('YYYY-MM-DD 23:59:59')}`
    }
    return {
      method: 'GET',
      url: `/services/infomation/getArticleList/${current}/${pageSize}?${query}`
    }
  }
  const btnList = () => {
    return (
      <Space>
        <Button type='primary' onClick={() => updateArticle('add')}>新建</Button>
        <Popconfirm
          title="数据删除后无法恢复，确认删除吗？"
          onConfirm={() => deleteArticle(selectRowKeys)}
          okText="确定"
          cancelText="取消"
        >
          <Button danger disabled={selectRowKeys.length ? false : true} >批量删除</Button>
        </Popconfirm>
      </Space>
    )
  }
  const onSelectChange = (keys: Array<any>, rows: Array<any>) => {
    setselectRowKeys(keys)
  }
  return (
    <div>
      <Tabs activeKey={activeKey} type='card' style={{ background: '#fff' }} onChange={(key) => { setActiveKey(key);setselectRowKeys([])}}>
        <TabPane tab='未发布' key='1'>
          {activeKey === '1' ? <SearchTable columns={columns} onSelectChange={onSelectChange} formItems={SearchForm} btnList={btnList()} serchData={serchData}  getInstance={e => SetSearchTableThis(e)} /> : null }
        </TabPane>
        <TabPane tab='已发布' key='2'>
          {activeKey === '2' ? <SearchTable columns={columns} formItems={SearchForm} btnList={btnList()} serchData={serchData}  getInstance={e => SetSearchTableThis(e)} /> : null}
        </TabPane>
        <TabPane tab='已下线' key='3'>
          {activeKey === '3' ? <SearchTable columns={columns} formItems={SearchForm} btnList={btnList()} serchData={serchData}  getInstance={e => SetSearchTableThis(e)} />: null}
        </TabPane>
      </Tabs>
      <Modal
        title={type === 'detail' ? '文章详情' : type === 'edit' ? '编辑文章' : '新建文章'}
        visible={visible}
        width={1000}
        destroyOnClose
        footer={null}
        maskClosable={false}
      >
        <AddArticle
          type={type}
          id={id}
        />
      </Modal>
    </div>
  )
}
export default Article