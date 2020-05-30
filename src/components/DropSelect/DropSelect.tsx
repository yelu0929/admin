import React, { useState, useEffect } from 'react';
import { Form, Table, Spin, Button, Col, Input, Select, DatePicker } from 'antd';
import SearchTable, { ISearchTableProp } from '@/components/SearchTable/SearchTable'
import styles from './DropSelect.less'

const { Option } = Select

interface DropSelectProps {
  onChange?: (keys: Array<any>, rows: Array<any>) => void;
  initivalue?: string | number;
  rowKey?: string;
  name?: string;
  title?: string;
  disabled?: boolean;
  searchTableProps: ISearchTableProp;
}
const DropSelect: React.FC<DropSelectProps> = props => {
  const [open, setOpen] = useState<boolean>(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<any>>([])
  const [selectedRows, setSelectedRows] = useState<Array<any>>([])
  const { onChange, rowKey = 'id', name = 'name', title, disabled, searchTableProps } = props
  const handleChange = (value: Array<any>) => {
    let rows = selectedRows.filter(item => {
      return value.indexOf(item[rowKey]) > -1
    })
    if (onChange) {
      onChange(value, selectedRows);
    }
    setSelectedRowKeys(value)
    setSelectedRows(rows)
  }
  const onSelectChange = (keys: Array<any>, rows: Array<any>) => {
    setSelectedRowKeys(keys)
    setSelectedRows(rows)
    if (onChange) {
      onChange(keys, rows);
    }
  }
  return (
    <Select
      mode='multiple'
      value={selectedRowKeys}
      onChange={handleChange}
      onDropdownVisibleChange={(value) => {
        if (value) {
          setOpen(value)
        }
      }}
      // onBlur={() => this.setState({open: false})}
      open={open}
      dropdownRender={() => (
        <div className={styles.dropSelectTable}>
          <div style={{ overflow: 'hidden' }}>
            <h2 style={{ width: 300, float: 'left' }}>
              {title ? title : ''}
            </h2>
            <Button
              style={{ float: 'right' }}
              type="primary"
              onClick={() => {
                setOpen(false)
                if (onChange) {
                  onChange(selectedRowKeys, selectedRows);
                }
              }}
            >
              我选择好了
            </Button>
          </div>
          <SearchTable {...searchTableProps} onSelectChange={onSelectChange} />
        </div>
      )}
      disabled={disabled}
    >
      {selectedRows.map(item => {
        return <Option key={item[rowKey]} value={item[rowKey]}>{item[name]}</Option>
      })}
    </Select>
  )
}

export default DropSelect