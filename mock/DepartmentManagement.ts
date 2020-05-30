import { Request, Response } from 'express';

export const departmentData = [
  {
    name: '武汉水深火热公司',
    id: '10000',
    state: '1',
    isLeaf: false,
    fullName: '武汉水深火热公司',
    children: [
      {
        name: '总裁办',
        id: '10001',
        state: '1',
        parentId: '10000',
        isLeaf: false,
        fullName: '武汉水深火热公司>总裁办',
        children: [
          { name: '总裁运营部', id: '10010',parentId: '10001',state: '1',isLeaf: true,fullName: '武汉水深火热公司>总裁办>总裁运营部' },
          { name: '总裁人资', id: '10011',parentId: '10001',state: '1', isLeaf: true,fullName: '武汉水深火热公司>总裁办>总裁人资'},
        ],
      },
      {
        name: '水深部',
        id: '10002',
        state: '1',
        parentId: '10000',
        isLeaf: false,
        fullName: '武汉水深火热公司>水深部',
        children: [
          { name: '水深生产部', id: '10020',parentId: '10002',state: '1',isLeaf: true,fullName: '武汉水深火热公司>水深部>水深生产部', },
          { name: '水深资讯部', id: '10021',parentId: '10002',state: '1',isLeaf: true,fullName: '武汉水深火热公司>水深部>水深资讯部', },
        ],
      },
      {
        name: '火热部',
        id: '10003',
        state: '1',
        parentId: '10000',
        isLeaf: true,
        fullName: '武汉水深火热公司>火热部',
      },
      {
        name: '测试部门',
        id: '10004',
        state: '0',
        parentId: '10000',
        isLeaf: true,
        fullName: '武汉水深火热公司>测试部门',
      },
    ],
  }
]
const filter = (body, treeData) => {
  treeData.forEach((item, i) => {
    if (body.id === item.id) {
      treeData[i] = {...item, ...body}
    }
    if (item.children && item.children.length) {
      filter(body, item.children)
    }
  })
}
export default {
  'GET /services/department/getData': (req: Request, res: Response) => {
    res.send({
      status: 'ok',
      data: departmentData
    })
  },
  'POST /services/department/update': (req: Request, res: Response) => {
    const body = req.body
    filter(body, departmentData)
    res.send({
      status: 'ok',
    })
  },
}