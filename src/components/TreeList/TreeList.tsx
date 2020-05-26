import React, { useState, useEffect } from 'react'
import { Tree, Input } from 'antd'
const { TreeNode } = Tree
const { Search } = Input
interface TreeListProps {
  treeData: Array<treeItem>;
  checkable?: boolean;
  onCheckTreeKeys?: (keys: Array<string>) => void;
  onSelectTree?: (keys: Array<string>, node: treeItem) => void;
  isSearch?: boolean;
  width?: number | string;
}
export interface treeItem {
  id: string;
  name: string;
  children?: Array<treeItem>;
  state: string;
  parentId?: string;
  isLeaf?: boolean;
}
const TreeList: React.FC<TreeListProps> = props => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)
  const [searchKey, setSearchKey] = useState<string>('');
  const { treeData, checkable = false, onCheckTreeKeys, onSelectTree, isSearch = true, width = 300 } = props
  useEffect(() => {
    if (treeData && treeData.length) {
      setExpandedKeys([treeData[0].id])
      setSelectedKeys([treeData[0].id])
      if (onSelectTree) {
        onSelectTree([treeData[0].id], treeData[0])
      }
    }
  }, [treeData])
  const onExpand = (expandedKeys: any) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  }
  const onCheck = (checkedKeys: any) => {
    setCheckedKeys(checkedKeys)
    if (onCheckTreeKeys) {
      onCheckTreeKeys(checkedKeys)
    }
  }
  const onSelect = (selectedKeys: any, e: any) => {
    setSelectedKeys(selectedKeys);
    if (onSelectTree) {
      onSelectTree(selectedKeys, e.node.data)
    }
  }
  const renderTreeNode = (treeData: Array<treeItem>): any => {
    let result: Array<any> = []
    treeData.map((item: treeItem) => {
      let title: any = item.name
      if (searchKey && title.indexOf(searchKey) > -1) {
        let index = title.indexOf(searchKey);
        title = <span>{title.substring(0, index)}<span style={{ color: 'red', fontWeight: 'bold' }}>{searchKey}</span>{title.substring(index + searchKey.length)}</span>;
      }
      let node = (<TreeNode
        disabled={item.state !== '1'} data={item}
        title={<span>{title}{item.state === '0' ? '(已停用)' : ''}</span>} key={item.id} isLeaf={item.isLeaf}>
        {
          item.children && item.children.length > 0 &&
          renderTreeNode(item.children)
        }
      </TreeNode>);
      result.push(node);
    })
    return result
  }
  const onChange = (e: any) => {
    const dataList = generateList(treeData)
    const expandedKeys = dataList
      .map((item: any) => {
        if (item.name.indexOf(e.target.value) > -1) {
          return getParentKey(item.id, treeData);
        }
        return null;
      })
      .filter((item: any, i: any, self: any) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys)
    setSearchKey(e.target.value)
    setAutoExpandParent(true)
  }
  const generateList = (treeData: Array<treeItem>): any => {
    let dataList: Array<any> = [];
    const flatData = (data: Array<treeItem>) => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        dataList.push({ id: node.id, name: node.name });
        if (node.children) {
          flatData(node.children);
        }
      }
    }
    flatData(treeData);
    return dataList;
  };
  const getParentKey = (key: any, tree: Array<treeItem>): any => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item: treeItem) => item.id === key)) {
          parentKey = node.id;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  }
  return (
    <div style={{ width, overflow: 'auto'}}>
      {isSearch && <Search style={{ marginBottom: 8 }} placeholder="搜索" onChange={onChange} />}
      <Tree
        checkable={checkable}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
      >
        {renderTreeNode(treeData)}
      </Tree>
    </div>
  )
}
export default TreeList