import { Request, Response } from 'express';
import {userList} from './userManagement'
// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // GET POST 可省略
  'POST /services/login': (req: Request, res: Response) => {
    const { password, userName, type } = req.body;
    if (password === '123456' && userList.some(item => item.userName === userName)) {
      res.send({
        status: 'ok',
        msg: '登陆成功',
        data: userList.filter(item => item.userName === userName),
      });
      return;
    }
    res.send({
      status: 'error',
      msg: '用户名或密码错误'
    });
  },
  'POST /services/logout': (req: Request, res: Response) => {
    res.send({
      status: 'ok',
    });
  },
};
