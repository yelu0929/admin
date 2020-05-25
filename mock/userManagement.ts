import { Request, Response } from 'express';
import moment from 'moment'
import {lookup} from './lookup'
export const userList = [
  {id: 100000, userName: 'admin', email: 'admin@sina.com', phone: '18888888888', creatDate: '2020-05-23 10:00:00', edu: '4'},
  {id: 100001, userName: 'user', email: 'user@sina.com', phone: '18888880000', creatDate: '2020-05-23 10:10:00', edu: '3'},
  {id: 100002, userName: 'guest', email: 'guest@sina.com', phone: '18888881111', creatDate: '2020-05-23 10:20:00', edu: '3'},
]
for (let i = 0; i < 20; i++) {
  userList.push({
    id: Math.floor(Math.random() * 100000),
    userName: `guest${i}`,
    email: `guest${i}@sina.com`,
    phone: String(Math.floor(Math.random() * 100000000)),
    creatDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    edu: '1',
  })
}
const eduOptions = lookup.edu
// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // GET POST 可省略
  'GET /services/user/getUserList/:current/:pageSize': (req: Request, res: Response) => {
    const { current,pageSize } = req.params;
    const query = req.query
    let userData = userList.map(item => item)
    Object.keys(query).forEach(item => {
      userData = userData.filter(v => v[item] === query[item])
    })
    userData = userData.slice((Number(current) - 1) * Number(pageSize), Number(current) * Number(pageSize))
    userData.forEach(item => {
      eduOptions.forEach(v => {
        if (item.edu === v.value) {
          item.eduDesp = v.label
        }
      })
    })
    res.send({
      status: 'ok',
      root: {
        totalNum: userList.length,
        data: userData
      }
    });
  },
  'POST /services/user/add': (req: Request, res: Response) => {
    let body = req.body
    body.id = Math.floor(Math.random() * 100000)
    body.creatDate = moment().format('YYYY-MM-DD HH:mm:ss')
    if (body.userName && body.phone) {
      userList.unshift(body)
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
  'POST /services/user/update': (req: Request, res: Response) => {
    let body = req.body
    if (body.id && body.userName && body.phone) {
      userList.forEach((item, i) => {
        if (item.id === body.id) {
          body.creatDate = item.creatDate
          userList[i] = body
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
  'Post /services/user/delete': (req: Request, res: Response) => {
    const ids = req.body;
    if (Array.isArray(ids)) {
      ids.forEach((id: number | string) => {
        let indexNum = null
        userList.forEach((item, index) => {
          if (item.id === Number(id)) {
            indexNum = index
          }
        })
        if (indexNum !== null) {
          userList.splice(indexNum, 1)
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
