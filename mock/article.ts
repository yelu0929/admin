import { Request, Response } from 'express';
import moment from 'moment'
import { userList } from './userManagement'
import {departmentData} from './DepartmentManagement'
export const articleList: Array<any> = [
  {id: 1000000, title: '香港国安法', content: '<p>维护国家安全</p>', dep: ['10000', '10001'], authorId: 100000, creatDate: '2020-05-23 10:00:00', state: '2'},
  {id: 1000001, title: '民法典', content: '<p>中国第一部法典</p>', dep: ['10000', '10002'], authorId: 100001, creatDate: '2020-05-23 10:10:00', state: '1'},
  {id: 1000002, title: '人名代表大会', content: '<p>国家权力机关</p>', dep: ['10000', '10001', '10010'], authorId: 100002, creatDate: '2020-05-23 10:20:00', state: '3'},
]
for (let i = 0; i < 20; i++) {
  articleList.push({
    id: Math.floor(Math.random() * 100000000),
    title: `测试${i}`,
    // author: `guest${i}`,
    creatDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    state: String(i%4 || 1),
  })
}
const filterDep = (treeData: Array<any>, key: string) => {
  let fullName = ''
  const filter = (treeData: Array<any>, key: string) => {
    treeData.map((item: any) => {
      if (item.id === key) {
        fullName = item.fullName
      }
      if (item.children && item.children.length) {
        filter(item.children, key)
      }
    })
  }
  filter(treeData, key)
  return fullName
}
// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // GET POST 可省略
  'GET /services/infomation/getArticleList/:current/:pageSize': (req: Request, res: Response) => {
    const { current,pageSize } = req.params;
    const query = req.query
    let articleData = articleList.map(item => item)
    if (query.state) {
      articleData = articleData.filter(v => v.state === query.state)
    }
    if (query.title) {
      articleData = articleData.filter(v => v.title.indexOf(query.title) > -1)
    }
    if (query.dep) {
      articleData = articleData.filter(v => v.dep && v.dep.toString() === query.dep)
    }
    if (query.startDate && query.endDate) {
      articleData = articleData.filter(v => moment(query.startDate) < moment(v.creatDate) && moment(v.creatDate) < moment(query.endDate))
    }
    const length = articleData.length
    articleData = articleData.slice((Number(current) - 1) * Number(pageSize), Number(current) * Number(pageSize))
    articleData.forEach(item => {
      let authorList = userList.filter(v => v.id === item.authorId)
      if (authorList && authorList.length) {
        item.authorName = userList.filter(v => v.id === item.authorId)[0].userName
      }
      item.departmentName = filterDep(departmentData, item.dep && item.dep.length ? item.dep[item.dep.length - 1] : '')
    })
    res.send({
      status: 'ok',
      root: {
        totalNum: length,
        data: articleData
      }
    });
  },
  'POST /services/infomation/article/add': (req: Request, res: Response) => {
    let body = req.body
    body.id = Math.floor(Math.random() * 100000)
    body.creatDate = moment().format('YYYY-MM-DD HH:mm:ss')
    if (body.title && body.phone) {
      articleList.unshift(body)
      res.send({
        status: 'ok',
        msg: '操作成功'
      });
    } else {
      res.send({
        status: 'error',
        msg: '传入参数错误'
      });
    }
  },
  'POST /services/infomation/article/update': (req: Request, res: Response) => {
    let body = req.body
    if (body.id && body.title) {
      articleList.forEach((item, i) => {
        if (item.id === body.id) {
          articleList[i] = {...item, ...body}
        }
      })
      res.send({
        status: 'ok',
        msg: '操作成功'
      });
    } else {
      res.send({
        status: 'error',
        msg: '传入参数错误'
      });
    }
  },
  'Post /services/infomation/article/delete': (req: Request, res: Response) => {
    const ids = req.body;
    if (Array.isArray(ids)) {
      ids.forEach((id: number | string) => {
        let indexNum = null
        articleList.forEach((item, index) => {
          if (item.id === Number(id)) {
            indexNum = index
          }
        })
        if (indexNum !== null) {
          articleList.splice(indexNum, 1)
        }
      })
      res.send({
        status: 'ok',
        msg: '操作成功'
      });
    } else {
      res.send({
        status: 'error',
        msg: '传入参数错误'
      });
    }
  },
};
