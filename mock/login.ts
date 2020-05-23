import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // GET POST 可省略
  'POST /services/login': (req: Request, res: Response) => {
    const { password, userName, type } = req.body;
    if (password === '123456' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }
    if (password === '123456' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /services/logout': (req: Request, res: Response) => {
    const {  userName } = req.body;
    if (userName === 'admin') {
      res.send({
        status: 'ok',
      });
      return;
    }
    res.send({
      status: 'error',
    });
  },
};
