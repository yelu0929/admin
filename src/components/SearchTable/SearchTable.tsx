import React, { Component, ReactNode } from 'React'
import { Table, Spin, Form, Button, Space } from 'antd';
import { connect, Dispatch } from 'umi';
import { FormInstance } from 'antd/lib/form'
import { getServices } from '@/services/searchTable'
import styles from './SearchTable.less'

export interface serchData {
  method: string;
  url: string;
  data?: object;
}
export interface transDataVoid {
  data: Array<any>;
  total: number;
}
interface ISearchTableProp {
  serchData: (values: any, current: number, pageSize: number) => serchData;
  pageSize?: number;
  transData?: (response: any) => transDataVoid;
  formItems?: any;
  btnList?: ReactNode;
  scroll?: any;
  columns: Array<any>;
  rowSelection?: boolean;
  isNotPagination?: boolean;
  rowKey?: string;
  type?: 'checkbox' | 'radio';
  onSelectChange?: (selectedRowKeys: Array<any>, selectedRows: Array<any>) => void;
  getCheckboxProps?: (record: any) => any;
  getInstance?: (ref: SearchTable) => void
}
interface ISeacrhTableState {
  currentPage: number;
  pageSize: number;
  total: number;
  dataSource: Array<any>;
  selectedRowKeys: Array<any>;
  selectedRows: Array<any>;
  loading: boolean;
}
export default class SearchTable extends Component<ISearchTableProp, ISeacrhTableState> {
  static defaultProps = {
    pageSize: 10,
    isNotPagination: false,
    rowSelection: true,
    rowKey: 'id',
    transData: (response: any) => {
      return {
        data: response.root.data || response.root.list, // dataSource
        total: response.root.totalNum, // 总页数
      };
    },
  };
  constructor(props: ISearchTableProp) {
    super(props)
    this.state = {
      currentPage: 1,
      pageSize: this.props.pageSize || 10,
      total: 0,
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      loading: false,
    }
  }
  formRef = React.createRef<FormInstance>()
  componentDidMount() {
    if (this.props.getInstance) {
      this.props.getInstance(this);
    }
    this.getTableData()
  }
  getTableData = () => {
    if (this.props.serchData) {
      this.formRef.current.validateFields().then(values => {
        console.log('values', values)
        let requestData = this.props.serchData(
          values,
          this.state.currentPage,
          this.state.pageSize,
        )
        this.setState({
          selectedRowKeys: [],
          selectedRows: [],
        })
        getServices(requestData).then(res => {
          if (res) {
            if (res.status === 'ok') {
              let data = res
              if (this.props.transData) {
                data = this.props.transData(res)
              }
              this.setState({
                dataSource: data.data || [],
                total: data.total || 0
              })
            }
          }
        })
      })
    }
  }

  refresh = () => {
    this.setState({ currentPage: 1 }, () => {
      this.getTableData();
    });
  };

  onReset = () => {
    this.formRef.current.resetFields()
    this.refresh()
  }
  onFinish = values => {
  };
  render(): ReactNode {
    const { formItems, btnList, columns, rowKey, scroll } = this.props
    const { dataSource, selectedRowKeys, currentPage, pageSize, total, loading } = this.state
    return (
      <div className={styles.main}>
        <Spin spinning={loading}>
          <div className={styles.searchForm}>
            <Form
              layout="inline"
              style={{ overflow: 'hidden', paddingTop: 10 }}
              // {...this.props.formProps}
              className={styles.formStyle}
              onFinish={this.getTableData}
              ref={this.formRef}
              name='searchTable'
            >
              {this.props.formItems ? (
                <div style={{width: '100%'}}>
                  <this.props.formItems />
                  <div style={{marginTop: 20}}>
                    <Space>
                      <Button type='primary' htmlType='submit'>查询</Button>
                      <Button htmlType='button' onClick={this.onReset}>重置</Button>
                    </Space>
                  </div>
                </div>
              ) : null}
            </Form>
          </div>
          {btnList && <div className={styles.btnList}>{btnList}</div>}
          <Table
            // className={this.props.className}
            columns={columns}
            rowKey={rowKey || 'id'}
            dataSource={dataSource}
            bordered
            scroll={scroll}
            rowSelection={
              this.props.rowSelection ?
                {
                  selectedRowKeys,
                  type: this.props.type || 'checkbox',
                  onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({ selectedRowKeys, selectedRows });
                    if (this.props.onSelectChange) {
                      this.props.onSelectChange(selectedRowKeys, selectedRows);
                    }
                  },
                  getCheckboxProps: record => {
                    if (this.props.getCheckboxProps) {
                      return this.props.getCheckboxProps(record);
                    }
                    return record;
                  },
                } : null}
            pagination={this.props.isNotPagination ? false : {
              pageSize: pageSize,
              current: currentPage,
              total: total,
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: total => {
                return `共${total}条记录`;
              },
              onChange: (page) => {
                this.setState({ currentPage: page }, this.getTableData);
              },
              onShowSizeChange: (current, pageSize) => {
                this.setState({ pageSize }, this.getTableData);
              }
            }}
          />
        </Spin>
      </div>
    )
  }
}